sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"
],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () { // Model for global variables
            var oModel = new JSONModel()
            oModel.setData({isSelected: false, isEditable: false})
            this.getView().setModel(oModel, 'selectionControl')

            // Model for selection context
            var oSelectionModel = new JSONModel()
            oSelectionModel.setData({
                selectedItem: {
                    categoryCode: '',
                    categoryText: ''
                }
            })
            this.getView().setModel(oSelectionModel, 'selectionModel')

        },
        /**
             * @override
             */

        onCategoryOperation: function (oEvent) {

            var bEditModeFlag = oEvent.getParameters().id.includes('Edit') ? true : false;

            var oView = this.getView()
            oView.getModel('selectionControl').setProperty('/isEditable', bEditModeFlag)

            if (! bEditModeFlag) {
                this.getView().getModel("selectionModel").setProperty("/selectedContext", '');
            }

            this._loadFragment(this, oView, 'idTaxCategoryDialog', "project1.fragments.taxCategoryDialog")
        },

        onCategoryDeletion: function () {
            var oBindingContext = this.getView().getModel('selectionModel').getProperty('/selectedContext')

            oBindingContext.delete()
            this.getView().getModel().submitBatch('categoryGroup')
        },

        onTypeOperation: function (oEvent) {

            var bEditModeFlag = oEvent.getParameters().id.includes('Edit') ? true : false;

            var oView = this.getView()
            oView.getModel('selectionControl').setProperty('/isEditable', bEditModeFlag)

            this._loadFragment(this, oView, 'idTaxTypeDialog', "project1.fragments.taxTypeDialog")
        },

        onSaveButtonPress: function (oEvent) {

            var bEditableFlag = this.getView().getModel('selectionControl').getProperty('/isEditable')
            // var oItemData = this.getView().getModel('selectionModel').getProperty('/selectedItem')

            var oBindingContext = this.getView().getModel('selectionModel').getProperty('/selectedContext')

            if (! bEditableFlag) {
                var categoryCode = this.byId('idCategoryCodeInput').getValue()
                var categoryText = this.byId('idCategoryTextInput').getValue()
                var createData = {
                    categoryCode: categoryCode,
                    categoryText: categoryText
                }
                this.getView().byId('idTaxCategoryTable').getBinding('items').create(createData)
            }

            // Get dialog id
            var sId = oEvent.getSource().getParent().getId()                        

            this.getView().getModel().submitBatch('categoryGroup').then(() => {
                console.log('success');
                // Close dialog             
                this.byId(sId).close()
                this.getView().byId('idTaxCategoryTable')
            }, () => {
                console.log('error');
                this.byId(sId).close()
            }).bind(this);

        },

        onCancelDialogPress: function (oEvent) { // Get dialog id
            var sId = oEvent.getSource().getParent().getId()

            // Close dialog
            this.byId(sId).close()
        },

        onTableSelectionChange: function (oEvent) { // Set selected flag equal to true
            this.getView().getModel('selectionControl').setProperty('/isSelected', true)

            // Get selected item data
            var oSelectedItem = oEvent.getParameter("listItem").getBindingContext().getObject()

            // Pass data to selection model
            // this.getView().getModel("selectionModel").setProperty("/selectedItem", oSelectedItem);

            var oBindingContext = oEvent.getParameter("listItem").getBindingContext()
            this.getView().getModel("selectionModel").setProperty("/selectedContext", oBindingContext);

        },

        onIconTabBarSelect: function (oEvent) { // Reset selection flag
            this.getView().getModel('selectionControl').setProperty('/isSelected', false)

            // Based on selected key, reset table selection
            switch (oEvent.getParameter('key')) {
                case 'category':
                    this.getView().byId('idTaxCategoryTable').removeSelections()
                    break;
                case 'type':
                    this.getView().byId('idTaxTypeTable').removeSelections()
                    break;
                case 'mapping':
                    this.getView().byId('idMappingTable').removeSelections()
                    break;
                default:
                    break;
            }

        },

        _loadFragment: function (oContext, oView, sId, sDialogName) {

            var that = this
            var oBindingContext = that.getView().getModel('selectionModel').getProperty('/selectedContext')

            if (!this.byId(sId)) {
                var mOptions = {
                    id: oView.getId(),
                    name: sDialogName,
                    controller: oContext
                }
                Fragment.load(mOptions).then((oDialog) => {
                    oView.addDependent(oDialog)

                    oDialog.open()
                    oDialog.setBindingContext(oBindingContext)

                    oDialog.setModel(oView.getModel('selectionModel'), 'selectionModel')
                })
            } else {
                var oDialog = oContext.byId(sId)
                oDialog.setBindingContext(oBindingContext)
                oDialog.open()

            }
        }
    });
});
