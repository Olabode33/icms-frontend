export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

    static remoteServiceBaseUrl: string;
    static remoteServiceBaseUrlFormat: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static appBaseUrlFormat: string;
    static recaptchaSiteKey: string;
    static subscriptionExpireNootifyDayCount: number;

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'ICMSDemo'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };

    static readonly grid = {
        defaultPageSize: 10
    };


    static readonly SelectedModuleKey = 'selectedModule';
    static readonly ModuleKeyValueInternalControl = 'internalControl';
    static readonly ModuleKeyValueInternalAudit = 'internalAudit';
    static readonly ModuleKeyValueOpRisk = 'opRisk';
    static readonly ModuleKeyValueGeneral = 'general';

    static getLikelihoodStatusColor(likelihood: number): string {
        switch (likelihood) {
            case 1:
                return '#2196F3';
            case 2:
                return '#00BCD4';
            case 3:
                return '#FFC107';
            case 4:
                return '#FF5722';
            case 5:
                return 'red';
        }
    }
}
