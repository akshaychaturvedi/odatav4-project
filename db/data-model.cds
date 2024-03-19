namespace com.sap.tax;

context TaxType {

    entity Types {
        key typeCode : String(4);
            typeText : String(25);
    }

    entity Categories {
        key categoryCode : String(4);
            categoryText : String(25);
    }

    entity Mappings {
        key companyCode  : String(4);
        key fiscalYear   : Integer;
        key typeCode     : Association to Types;
        key categoryCode : Association to Categories;
            materiality  : String(15) enum {
                Material;
                Immaterial;
                NA = 'Not Applicable';
            };

    }
}

context Usage {

    entity Metrics {
        key tenantId      : UUID;
        key orgId         : UUID;
        key appId         : UUID;
        key featureType   : String(2);
        key dataTime      : Timestamp;
            appName       : String(20);
            unitOfMeasure : String(2);
            quantity      : Integer;

    }
}
