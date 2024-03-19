using {
    com.sap.tax.TaxType as DB,
    com.sap.tax.Usage as DB1
} from '../db/data-model';


service TaxService {

    entity Types           as projection on DB.Types;
    entity Categories      as projection on DB.Categories;
    entity Mappings        as projection on DB.Mappings;
    
    entity MetricsUsage    as projection on DB1.Metrics;

    entity MetricsUsageAgg as
        projection on DB1.Metrics {
            key tenantId,
            key orgId,
            key appId,
            key featureType,
                sum(quantity) as sumValue : Integer
        } group by tenantId, orgId, appId, featureType;

}
