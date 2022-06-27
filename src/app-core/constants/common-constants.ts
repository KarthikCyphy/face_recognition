export class CommonConstants {


    static readonly successMessageSent = 'Message sent successfully.';

    static readonly passwordFormSuccessMessage = 'Password updated successfully.';

    static readonly profileFormSuccessMessage = 'Profile updated successfully.';

    static readonly applicationFormSuccessMessage = 'Application settings updated successfully.';

    static readonly APITimeoutErrorMessage = 'Oops! This is taking longer than usual. ' +
        'Please refresh the page or contact your administrator.';

    static readonly APICallCommon = {
        errorMessageTitle: 'Alert',
        errorMessagePopupTitle: 'Alert (Click to expand)',
        serverErrorMessage: 'Internal server error.',
        sessionErrorMessage: 'Your Session is Timeout, Please re-login.',
        permissionErrorMessage: 'You do not have permission to access this module.',
        settingPermissionErrorMessage: 'You do not have permission to access this setting.'
    };

    static readonly dataTableConstant = {
        page: 1,
        pageSize: 20,
    };

    static readonly loaderMessages = {
        loaderDisplayText: '',
        loaderDisplayTextForDownload: 'Generating reports, Please wait.',
        loaderDisplayTextForUploadingFile: 'Processing, Please wait.',
    };

}
