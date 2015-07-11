var Library;
(function (Library) {
    var UrlResolver;
    (function (UrlResolver) {
        var UrlResolverService = (function () {
            function UrlResolverService($rootElement) {
                this._base = $rootElement.attr("data-url-base");
                // Add trailing slash if not present
                if (this._base === "" || this._base.substr(this._base.length - 1) !== "/") {
                    this._base = this._base + "/";
                }
            }
            Object.defineProperty(UrlResolverService.prototype, "base", {
                get: function () {
                    return this._base;
                },
                enumerable: true,
                configurable: true
            });
            UrlResolverService.prototype.resolveUrl = function (relativeUrl) {
                var firstChar = relativeUrl.substr(0, 1);
                if (firstChar === "~") {
                    relativeUrl = relativeUrl.substr(1);
                }
                firstChar = relativeUrl.substr(0, 1);
                if (firstChar === "/") {
                    relativeUrl = relativeUrl.substr(1);
                }
                return this._base + relativeUrl;
            };
            return UrlResolverService;
        })();
    })(UrlResolver = Library.UrlResolver || (Library.UrlResolver = {}));
})(Library || (Library = {}));
