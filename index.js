/**
 * Installs the Vue-Storage Client
 * Vue Plugin to automate storage of data members using LocalStorage or Cookies
 * 
 * @module vue-storage/client
 * @author Justin MacArthur <macarthurjustin@gmail.com>
 * @version 1.0.0
 * 
 * @param {Object} Vue
 * @param {Object} [options]
 */
if(!window.localStorage) {
    Object.defineProperty(
        window, "localStorage", 
        new (function () {
            var aKeys = [], oStorage = {};

            Object.defineProperty(
                oStorage, 
                "getItem", 
                {
                    value: function (sKey) { 
                        return sKey ? this[sKey] : null; 
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                }
            );

            Object.defineProperty(
                oStorage, 
                "key", 
                {
                    value: function (nKeyId) { 
                        return aKeys[nKeyId]; 
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                }
            );

            Object.defineProperty(
                oStorage, 
                "setItem", 
                {
                    value: function (sKey, sValue) {
                        if(!sKey) { return; }
                        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                }
            );

            Object.defineProperty(
                oStorage, 
                "length", 
                {
                    get: function () { 
                        return aKeys.length; 
                    },
                    configurable: false,
                    enumerable: false
                }
            );

            Object.defineProperty(
                oStorage, 
                "removeItem", 
                {
                    value: function (sKey) {
                        if(!sKey) { return; }
                        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                }
            );

            this.get = function () {
                var iThisIndx;
                for (var sKey in oStorage) {
                    iThisIndx = aKeys.indexOf(sKey);
                    if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
                    else { aKeys.splice(iThisIndx, 1); }
                    delete oStorage[sKey];
                }
                for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
                for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                    aCouple = aCouples[nIdx].split(/\s*=\s*/);
                    if (aCouple.length > 1) {
                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                    aKeys.push(iKey);
                    }
                }
                return oStorage;
            };

            this.configurable = false;
            this.enumerable = true;
        }
    )());
}

module.exports.install = function(Vue, options) {
    Vue.Storage = (function(options) {
        function setHandler(identifier, newValue) {
            window.localStorage.setItem(identifier, newValue)
        }

        function getHandler(identifier, defaultValue) {
            if(window.localStorage.length == 0) return defaultValue || null

            let value = window.localStorage.getItem(identifier)
            if(value == null) return defaultValue || null

            return value
        }

        function clearHandler(identifier) {
            if(window.localStorage.length == 0) return

            window.localStorage.removeItem(identifier)
        }

        return {
            setItem: setHandler,
            getItem: getHandler,
            removeItem: clearHandler
        }
    })(options);

    Vue.mixin(
        {
            created: function() {
                if (this.$options.storage) 
                {
                    let Handlers = this.$options.storage;
                    for (let index = 0; index < Handlers.length; index++) {
                        let Value = Vue.Storage.getItem(Handlers[index]);
                        if(Value != null) this.$data[Handlers[index]] = Value

                        Vue.Storage.setItem(Handlers[index], this.$data[Handlers[index]])

                        this.$methods[Handlers[index]] = this.$watch(
                            Handlers[index],
                            function(newVal) {
                                Vue.Storage.setItem(Handlers[index], newVal)
                            }
                        )
                    }
                }
            }
        }
    );
};