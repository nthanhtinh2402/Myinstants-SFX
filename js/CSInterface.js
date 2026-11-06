/** 
 * CSInterface - Adobe CEP 
 */
function CSInterface() {}

CSInterface.THEME_COLOR_CHANGED_EVENT = "com.adobe.csxs.events.ThemeColorChanged";

CSInterface.prototype.getHostEnvironment = function() {
    return JSON.parse(window.__adobe_cep__.getHostEnvironment());
};

CSInterface.prototype.closeExtension = function() {
    window.__adobe_cep__.closeExtension();
};

CSInterface.prototype.getSystemPath = function(pathType) {
    return decodeURI(window.__adobe_cep__.getSystemPath(pathType));
};

CSInterface.prototype.evalScript = function(script, callback) {
    if (callback === null || callback === undefined) {
        callback = function(result) {};
    }
    window.__adobe_cep__.evalScript(script, callback);
};

CSInterface.prototype.getApplicationID = function() {
    return this.getHostEnvironment().appId;
};

CSInterface.prototype.getApplicationVersion = function() {
    return this.getHostEnvironment().appVersion;
};

CSInterface.prototype.getExtensions = function(extensionIds) {
    var extensionIdsStr = JSON.stringify(extensionIds);
    return JSON.parse(window.__adobe_cep__.getExtensions(extensionIdsStr));
};

CSInterface.prototype.getNetworkPreferences = function() {
    return JSON.parse(window.__adobe_cep__.getNetworkPreferences());
};

CSInterface.prototype.initResourceBundle = function() {
    var resourceBundle = JSON.parse(window.__adobe_cep__.initResourceBundle());
    var resObj = {};
    for (var i = 0; i < resourceBundle.length; i++) {
        resObj[resourceBundle[i].key] = resourceBundle[i].value;
    }
    return resObj;
};

CSInterface.prototype.dumpInstallationInfo = function() {
    return window.__adobe_cep__.dumpInstallationInfo();
};

CSInterface.prototype.getOSInformation = function() {
    return window.__adobe_cep__.getOSInformation();
};

CSInterface.prototype.openURLInDefaultBrowser = function(url) {
    return window.__adobe_cep__.showTooltip(url);
};

CSInterface.prototype.getExtensionID = function() {
    return window.__adobe_cep__.getExtensionId();
};

CSInterface.prototype.getScaleFactor = function() {
    return window.__adobe_cep__.getScaleFactor();
};

CSInterface.prototype.setScaleFactorChangedHandler = function(handler) {
    window.__adobe_cep__.setScaleFactorChangedHandler(handler);
};

CSInterface.prototype.getCurrentApiVersion = function() {
    return JSON.parse(window.__adobe_cep__.getCurrentApiVersion());
};

CSInterface.prototype.setPanelFlyoutMenu = function(menu) {
    if ("string" != typeof menu) return;
    window.__adobe_cep__.invokeSync("setPanelFlyoutMenu", menu);
};

CSInterface.prototype.updatePanelMenuItem = function(menuItemLabel, enabled, checked) {
    var ret = false;
    if (this.getHostEnvironment().appId == "ILST" && this.getCurrentApiVersion().major <= 11) {
        var itemStatus = { menuItemLabel: menuItemLabel, enabled: enabled, checked: checked };
        ret = window.__adobe_cep__.invokeSync("updatePanelMenuItem", JSON.stringify(itemStatus));
    } else {
        ret = window.__adobe_cep__.invokeSync("updatePanelMenuItem", menuItemLabel, enabled, checked);
    }
    return ret;
};

CSInterface.prototype.setContextMenu = function(menu, callback) {
    if ("string" != typeof menu) return;
    if (callback === null || callback === undefined) { callback = function(actionId) {}; }
    window.__adobe_cep__.invokeAsync("setContextMenu", menu, callback);
};

CSInterface.prototype.setContextMenuByJSON = function(menu, callback) {
    if ("string" != typeof menu) return;
    if (callback === null || callback === undefined) { callback = function(actionId) {}; }
    window.__adobe_cep__.invokeAsync("setContextMenuByJSON", menu, callback);
};

CSInterface.prototype.requestOpenExtension = function(extensionId, params) {
    window.__adobe_cep__.requestOpenExtension(extensionId, params);
};

CSInterface.prototype.addEventListener = function(type, listener, obj) {
    window.__adobe_cep__.addEventListener(type, listener, obj);
};

CSInterface.prototype.removeEventListener = function(type, listener, obj) {
    window.__adobe_cep__.removeEventListener(type, listener, obj);
};

CSInterface.prototype.dispatchEvent = function(event) {
    if (typeof event.data == "object") {
        event.data = JSON.stringify(event.data);
    }
    window.__adobe_cep__.dispatchEvent(event);
};

var SystemPath = {
    USER_DATA: "userData",
    COMMON_FILES: "commonFiles",
    MY_DOCUMENTS: "myDocuments",
    APPLICATION: "application",
    EXTENSION: "extension",
    HOST_APPLICATION: "hostApplication"
};

var ColorType = { RGB: "rgb", GRADIENT: "gradient", NONE: "none" };