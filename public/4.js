(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./node_modules/reflect-metadata/Reflect.js":
/*!**************************************************!*\
  !*** ./node_modules/reflect-metadata/Reflect.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/vue-class-component/dist/vue-class-component.esm.js":
/*!**************************************************************************!*\
  !*** ./node_modules/vue-class-component/dist/vue-class-component.esm.js ***!
  \**************************************************************************/
/*! exports provided: default, createDecorator, mixins */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDecorator", function() { return createDecorator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mixins", function() { return mixins; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/**
  * vue-class-component v7.2.3
  * (c) 2015-present Evan You
  * @license MIT
  */


function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// The rational behind the verbose Reflect-feature check below is the fact that there are polyfills
// which add an implementation for Reflect.defineMetadata but not for Reflect.getOwnMetadataKeys.
// Without this check consumers will encounter hard to track down runtime errors.
function reflectionIsSupported() {
  return typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
}
function copyReflectionMetadata(to, from) {
  forwardMetadata(to, from);
  Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
    forwardMetadata(to.prototype, from.prototype, key);
  });
  Object.getOwnPropertyNames(from).forEach(function (key) {
    forwardMetadata(to, from, key);
  });
}

function forwardMetadata(to, from, propertyKey) {
  var metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
  metaKeys.forEach(function (metaKey) {
    var metadata = propertyKey ? Reflect.getOwnMetadata(metaKey, from, propertyKey) : Reflect.getOwnMetadata(metaKey, from);

    if (propertyKey) {
      Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
    } else {
      Reflect.defineMetadata(metaKey, metadata, to);
    }
  });
}

var fakeArray = {
  __proto__: []
};
var hasProto = fakeArray instanceof Array;
function createDecorator(factory) {
  return function (target, key, index) {
    var Ctor = typeof target === 'function' ? target : target.constructor;

    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }

    if (typeof index !== 'number') {
      index = undefined;
    }

    Ctor.__decorators__.push(function (options) {
      return factory(options, key, index);
    });
  };
}
function mixins() {
  for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
    Ctors[_key] = arguments[_key];
  }

  return vue__WEBPACK_IMPORTED_MODULE_0___default.a.extend({
    mixins: Ctors
  });
}
function isPrimitive(value) {
  var type = _typeof(value);

  return value == null || type !== 'object' && type !== 'function';
}
function warn(message) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message);
  }
}

function collectDataFromConstructor(vm, Component) {
  // override _init to prevent to init as Vue instance
  var originalInit = Component.prototype._init;

  Component.prototype._init = function () {
    var _this = this;

    // proxy to actual vm
    var keys = Object.getOwnPropertyNames(vm); // 2.2.0 compat (props are no longer exposed as self properties)

    if (vm.$options.props) {
      for (var key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
    }

    keys.forEach(function (key) {
      if (key.charAt(0) !== '_') {
        Object.defineProperty(_this, key, {
          get: function get() {
            return vm[key];
          },
          set: function set(value) {
            vm[key] = value;
          },
          configurable: true
        });
      }
    });
  }; // should be acquired class property values


  var data = new Component(); // restore original _init to avoid memory leak (#209)

  Component.prototype._init = originalInit; // create plain data object

  var plainData = {};
  Object.keys(data).forEach(function (key) {
    if (data[key] !== undefined) {
      plainData[key] = data[key];
    }
  });

  if (true) {
    if (!(Component.prototype instanceof vue__WEBPACK_IMPORTED_MODULE_0___default.a) && Object.keys(plainData).length > 0) {
      warn('Component class must inherit Vue or its descendant class ' + 'when class property is used.');
    }
  }

  return plainData;
}

var $internalHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch' // 2.6
];
function componentFactory(Component) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.name = options.name || Component._componentTag || Component.name; // prototype props.

  var proto = Component.prototype;
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return;
    } // hooks


    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key];
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(proto, key);

    if (descriptor.value !== void 0) {
      // methods
      if (typeof descriptor.value === 'function') {
        (options.methods || (options.methods = {}))[key] = descriptor.value;
      } else {
        // typescript decorated data
        (options.mixins || (options.mixins = [])).push({
          data: function data() {
            return _defineProperty({}, key, descriptor.value);
          }
        });
      }
    } else if (descriptor.get || descriptor.set) {
      // computed properties
      (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      };
    }
  });
  (options.mixins || (options.mixins = [])).push({
    data: function data() {
      return collectDataFromConstructor(this, Component);
    }
  }); // decorate options

  var decorators = Component.__decorators__;

  if (decorators) {
    decorators.forEach(function (fn) {
      return fn(options);
    });
    delete Component.__decorators__;
  } // find super


  var superProto = Object.getPrototypeOf(Component.prototype);
  var Super = superProto instanceof vue__WEBPACK_IMPORTED_MODULE_0___default.a ? superProto.constructor : vue__WEBPACK_IMPORTED_MODULE_0___default.a;
  var Extended = Super.extend(options);
  forwardStaticMembers(Extended, Component, Super);

  if (reflectionIsSupported()) {
    copyReflectionMetadata(Extended, Component);
  }

  return Extended;
}
var reservedPropertyNames = [// Unique id
'cid', // Super Vue constructor
'super', // Component options that will be used by the component
'options', 'superOptions', 'extendOptions', 'sealedOptions', // Private assets
'component', 'directive', 'filter'];
var shouldIgnore = {
  prototype: true,
  arguments: true,
  callee: true,
  caller: true
};

function forwardStaticMembers(Extended, Original, Super) {
  // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
  Object.getOwnPropertyNames(Original).forEach(function (key) {
    // Skip the properties that should not be overwritten
    if (shouldIgnore[key]) {
      return;
    } // Some browsers does not allow reconfigure built-in properties


    var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);

    if (extendedDescriptor && !extendedDescriptor.configurable) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(Original, key); // If the user agent does not support `__proto__` or its family (IE <= 10),
    // the sub class properties may be inherited properties from the super class in TypeScript.
    // We need to exclude such properties to prevent to overwrite
    // the component options object which stored on the extended constructor (See #192).
    // If the value is a referenced value (object or function),
    // we can check equality of them and exclude it if they have the same reference.
    // If it is a primitive value, it will be forwarded for safety.

    if (!hasProto) {
      // Only `cid` is explicitly exluded from property forwarding
      // because we cannot detect whether it is a inherited property or not
      // on the no `__proto__` environment even though the property is reserved.
      if (key === 'cid') {
        return;
      }

      var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);

      if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
        return;
      }
    } // Warn if the users manually declare reserved properties


    if ( true && reservedPropertyNames.indexOf(key) >= 0) {
      warn("Static property name '".concat(key, "' declared on class '").concat(Original.name, "' ") + 'conflicts with reserved property name of Vue internal. ' + 'It may cause unexpected behavior of the component. Consider renaming the property.');
    }

    Object.defineProperty(Extended, key, descriptor);
  });
}

function Component(options) {
  if (typeof options === 'function') {
    return componentFactory(options);
  }

  return function (Component) {
    return componentFactory(Component, options);
  };
}

Component.registerHooks = function registerHooks(keys) {
  $internalHooks.push.apply($internalHooks, _toConsumableArray(keys));
};

/* harmony default export */ __webpack_exports__["default"] = (Component);



/***/ }),

/***/ "./node_modules/vue-easy-dnd/dist/vue-easy-dnd.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/vue-easy-dnd/dist/vue-easy-dnd.esm.js ***!
  \************************************************************/
/*! exports provided: DnDEvent, Drag, DragAwareMixin, DragImagesManager, DragMixin, Drop, DropList, DropMask, DropMixin, InsertEvent, ReorderEvent, createDragImage, dnd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DnDEvent", function() { return DnDEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Drag", function() { return Drag$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DragAwareMixin", function() { return DragAwareMixin$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DragImagesManager", function() { return DragImagesManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DragMixin", function() { return DragMixin$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Drop", function() { return Drop$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropList", function() { return DropList$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropMask", function() { return DropMask$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DropMixin", function() { return DropMixin$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InsertEvent", function() { return InsertEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReorderEvent", function() { return ReorderEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDragImage", function() { return createDragImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dnd", function() { return dnd; });
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reflect_metadata__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-property-decorator */ "./node_modules/vue-property-decorator/lib/vue-property-decorator.js");



/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

/**
 * This is the class of the global object that holds the state of the drag and drop during its progress. It emits events
 * reporting its state evolution during the progress of the drag and drop. Its data is reactive and listeners can be
 * attachted to it using the method on.
 */
var DnD = function DnD() {
    this.inProgress = false;
    this.type = null;
    this.data = null;
    this.source = null;
    this.top = null;
    this.position = null;
    this.eventBus = new vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Vue"]();
    this.sourceListeners = null;
    this.success = null;
};
DnD.prototype.startDrag = function startDrag (source, event, x, y, type, data) {
    this.type = type;
    this.data = data;
    this.source = source;
    this.position = {
        x: x,
        y: y
    };
    this.top = null;
    this.sourceListeners = source.$listeners;
    this.inProgress = true;
    this.emit(event, "dragstart");
    this.emit(event, "dragtopchanged", { previousTop: null });
};
DnD.prototype.stopDrag = function stopDrag (event) {
    this.success = this.top !== null && this.top['compatibleMode'] && this.top['dropAllowed'];
    if (this.top !== null) {
        this.emit(event, "drop");
    }
    this.emit(event, "dragend");
    this.inProgress = false;
    this.data = null;
    this.source = null;
    this.position = null;
    this.success = null;
};
DnD.prototype.mouseMove = function mouseMove (event, comp) {
    if (this.inProgress) {
        var prevent = false;
        var previousTop = this.top;
        if (comp === null) {
            // The mouse move event reached the top of the document without hitting a drop component.
            this.top = null;
            prevent = true;
        }
        else if (comp['isDropMask']) {
            // The mouse move event bubbled until it reached a drop mask.
            this.top = null;
            prevent = true;
        }
        else if (comp['candidate'](this.type, this.data, this.source)) {
            // The mouse move event bubbled until it reached a drop component that participates in the current drag operation.
            this.top = comp;
            prevent = true;
        }
        if (prevent) {
            // We prevent the mouse move event from bubbling further up the tree because it reached the foremost drop component and that component is all that matters.
            event.stopPropagation();
        }
        if (this.top !== previousTop) {
            this.emit(event.detail.native, 'dragtopchanged', { previousTop: previousTop });
        }
        this.position = {
            x: event.detail.x,
            y: event.detail.y
        };
        this.emit(event.detail.native, 'dragpositionchanged');
    }
};
DnD.prototype.emit = function emit (native, event, data) {
    this.eventBus.$emit(event, Object.assign({}, {type: this.type,
        data: this.data,
        top: this.top,
        source: this.source,
        position: this.position,
        success: this.success,
        native: native},
        data));
};
DnD.prototype.on = function on (event, callback) {
    this.eventBus.$on(event, callback);
};
DnD.prototype.off = function off (event, callback) {
    this.eventBus.$off(event, callback);
};
var dnd = new DnD();
dnd = vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Vue"].observable(dnd);

var DragAwareMixin = /*@__PURE__*/(function (Vue) {
    function DragAwareMixin () {
        Vue.apply(this, arguments);
    }

    if ( Vue ) DragAwareMixin.__proto__ = Vue;
    DragAwareMixin.prototype = Object.create( Vue && Vue.prototype );
    DragAwareMixin.prototype.constructor = DragAwareMixin;

    var prototypeAccessors = { dragInProgress: { configurable: true },dragData: { configurable: true },dragType: { configurable: true },dragPosition: { configurable: true },dragSource: { configurable: true },dragTop: { configurable: true } };

    prototypeAccessors.dragInProgress.get = function () {
        return dnd.inProgress;
    };
    prototypeAccessors.dragData.get = function () {
        return dnd.data;
    };
    prototypeAccessors.dragType.get = function () {
        return dnd.type;
    };
    prototypeAccessors.dragPosition.get = function () {
        return dnd.position;
    };
    prototypeAccessors.dragSource.get = function () {
        return dnd.source;
    };
    prototypeAccessors.dragTop.get = function () {
        return dnd.top;
    };

    Object.defineProperties( DragAwareMixin.prototype, prototypeAccessors );

    return DragAwareMixin;
}(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Vue"]));
DragAwareMixin = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({})
], DragAwareMixin);
var DragAwareMixin$1 = DragAwareMixin;

/**
 * This files contains the primitives required to create drag images from HTML elements that serve as models. A snapshot
 * of the computed styles of the model elements is taken when creating the drag image, so that it will look the same as
 * the model, no matter where the drag images is grafted into the DOM.
 */
/**
 * Creates a drag image using the given element as model.
 */
function createDragImage(el) {
    var clone = deepClone(el);
    clone.style.position = 'fixed';
    clone.style.margin = '0';
    clone.style["z-index"] = '1000';
    clone.style.transition = 'opacity 0.2s';
    return clone;
}
/**
 * Clones the given element and all its descendants.
 */
function deepClone(el) {
    var clone = el.cloneNode(true);
    copyStyle(el, clone);
    var vSrcElements = el.getElementsByTagName("*");
    var vDstElements = clone.getElementsByTagName("*");
    for (var i = vSrcElements.length; i--;) {
        var vSrcElement = vSrcElements[i];
        var vDstElement = vDstElements[i];
        copyStyle(vSrcElement, vDstElement);
    }
    return clone;
}
/**
 * Copy the computed styles from src to destination.
 */
function copyStyle(src, destination) {
    var computedStyle = window.getComputedStyle(src);
    Array.from(computedStyle).forEach(function (key) {
        destination.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key));
    });
    destination.style.pointerEvents = 'none';
}

var DragMixin = /*@__PURE__*/(function (DragAwareMixin) {
    function DragMixin() {
        DragAwareMixin.apply(this, arguments);
        this.isDrag = true;
        this.mouseIn = null;
    }

    if ( DragAwareMixin ) DragMixin.__proto__ = DragAwareMixin;
    DragMixin.prototype = Object.create( DragAwareMixin && DragAwareMixin.prototype );
    DragMixin.prototype.constructor = DragMixin;

    var prototypeAccessors = { dragIn: { configurable: true },cssClasses: { configurable: true },currentDropMode: { configurable: true } };
    DragMixin.prototype.created = function created () {
        this.reEmit("dragstart");
        this.reEmit("dragend");
    };
    DragMixin.prototype.reEmit = function reEmit (eventName) {
        var this$1 = this;

        dnd.on(eventName, function (ev) {
            if (ev.source === this$1) {
                this$1.$emit(eventName, ev);
            }
        });
    };
    DragMixin.prototype.mounted = function mounted () {
        var isNodeList = function (el) {
            return 'item' in el;
        };
        var comp = this;
        var el = this.$el;
        var dragStarted = false;
        var initialUserSelect;
        var downEvent = null;
        var startPosition = null;
        if (this.handle) {
            el = this.$el.querySelectorAll(this.handle);
        }
        if (isNodeList(el)) {
            el.forEach(function (element) {
                element.addEventListener('mousedown', onMouseDown);
                element.addEventListener('touchstart', onMouseDown);
                element.addEventListener('mouseenter', onMouseEnter);
                element.addEventListener('mouseleave', onMouseLeave);
            });
        }
        else {
            el.addEventListener('mousedown', onMouseDown);
            el.addEventListener('touchstart', onMouseDown);
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        }
        function onMouseEnter() {
            comp.mouseIn = true;
        }
        function onMouseLeave() {
            comp.mouseIn = false;
        }
        function noop(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        function onMouseDown(e) {
            if (!comp.disabled && downEvent === null) {
                initialUserSelect = document.body.style.userSelect;
                document.documentElement.style.userSelect = 'none'; // Permet au drag de se poursuivre normalement même
                // quand on quitte un élémént avec overflow: hidden.
                dragStarted = false;
                downEvent = e;
                if (downEvent.type === 'mousedown') {
                    var mouse = event;
                    startPosition = {
                        x: mouse.clientX,
                        y: mouse.clientY
                    };
                }
                else {
                    var touch = event;
                    startPosition = {
                        x: touch.touches[0].clientX,
                        y: touch.touches[0].clientY
                    };
                }
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('touchmove', onMouseMove, { passive: false });
                document.addEventListener('easy-dnd-move', onEasyDnDMove);
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('touchend', onMouseUp);
                document.addEventListener('selectstart', noop);
                // Prevents event from bubbling to ancestor drag components and initiate several drags at the same time
                e.stopPropagation();
                // Prevents touchstart event to be converted to mousedown
                //e.preventDefault();
            }
        }
        function onMouseMove(e) {
            // We ignore the mousemove event that follows touchend :
            if (downEvent === null)
                { return; }
            // On touch devices, we ignore fake mouse events and deal with touch events only.
            if (downEvent.type === 'touchstart' && e.type === 'mousemove')
                { return; }
            // Find out event target and pointer position :
            var target;
            var x;
            var y;
            if (e.type === 'touchmove') {
                var touch = e;
                x = touch.touches[0].clientX;
                y = touch.touches[0].clientY;
                target = document.elementFromPoint(x, y);
            }
            else {
                var mouse = e;
                x = mouse.clientX;
                y = mouse.clientY;
                target = mouse.target;
            }
            // Distance between current event and start position :
            var dist = Math.sqrt(Math.pow(startPosition.x - x, 2) + Math.pow(startPosition.y - y, 2));
            // If the drag has not begun yet and distance from initial point is greater than delta, we start the drag :
            if (!dragStarted && dist > comp.delta) {
                dragStarted = true;
                dnd.startDrag(comp, downEvent, startPosition.x, startPosition.y, comp.type, comp.data);
                document.documentElement.classList.add('drag-in-progress');
            }
            // Dispatch custom easy-dnd-move event :
            if (dragStarted) {
                var custom = new CustomEvent("easy-dnd-move", {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        x: x,
                        y: y,
                        native: e
                    }
                });
                target.dispatchEvent(custom);
            }
            // Prevent scroll on touch devices :
            e.preventDefault();
        }
        function onEasyDnDMove(e) {
            dnd.mouseMove(e, null);
        }
        function onMouseUp(e) {
            // On touch devices, we ignore fake mouse events and deal with touch events only.
            if (downEvent.type === 'touchstart' && e.type === 'mouseup')
                { return; }
            downEvent = null;
            // This delay makes sure that when the click event that results from the mouseup is produced, the drag is still
            // in progress. So by checking the flag dnd.inProgress, one can tell appart true clicks from drag and drop artefacts.
            setTimeout(function () {
                if (dragStarted) {
                    document.documentElement.classList.remove('drag-in-progress');
                    dnd.stopDrag(e);
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('touchmove', onMouseMove);
                document.removeEventListener('easy-dnd-move', onEasyDnDMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchend', onMouseUp);
                document.removeEventListener('selectstart', noop);
                document.documentElement.style.userSelect = initialUserSelect;
            }, 0);
        }
    };
    prototypeAccessors.dragIn.get = function () {
        return !this.dragInProgress && this.mouseIn;
    };
    prototypeAccessors.cssClasses.get = function () {
        if (!this.disabled) {
            return {
                'drag-source': this.dragInProgress && this.dragSource === this,
                'drag-in': this.dragIn,
                'drag-out': !this.dragIn,
                'drag-mode-copy': this.currentDropMode === 'copy',
                'drag-mode-cut': this.currentDropMode === 'cut',
                'drag-mode-reordering': this.currentDropMode === 'reordering',
            };
        }
        else {
            return {};
        }
    };
    prototypeAccessors.currentDropMode.get = function () {
        if (this.dragInProgress && this.dragSource === this) {
            if (this.dragTop && this.dragTop['dropAllowed']) {
                if (this.dragTop['reordering'])
                    { return 'reordering'; }
                else
                    { return this.dragTop['mode']; }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    DragMixin.prototype.createDragImage = function createDragImage$1 (selfTransform) {
        var image;
        if (this.$scopedSlots['drag-image']) {
            var el = this.$refs['drag-image'];
            if (el.childElementCount !== 1) {
                image = createDragImage(el);
            }
            else {
                image = createDragImage(el.children.item(0));
            }
        }
        else {
            image = createDragImage(this.$el);
            image.style.transform = selfTransform;
        }
        image['__opacity'] = this.dragImageOpacity;
        return image;
    };

    Object.defineProperties( DragMixin.prototype, prototypeAccessors );

    return DragMixin;
}(DragAwareMixin$1));
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: null, type: null }),
    __metadata("design:type", String)
], DragMixin.prototype, "type", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: null, type: null }),
    __metadata("design:type", Object)
], DragMixin.prototype, "data", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 0.7, type: Number }),
    __metadata("design:type", Object)
], DragMixin.prototype, "dragImageOpacity", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: false, type: Boolean }),
    __metadata("design:type", Boolean)
], DragMixin.prototype, "disabled", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: false, type: Boolean }),
    __metadata("design:type", Boolean)
], DragMixin.prototype, "goBack", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ required: false, type: String }),
    __metadata("design:type", String)
], DragMixin.prototype, "handle", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ type: Number, default: 3 }),
    __metadata("design:type", Number)
], DragMixin.prototype, "delta", void 0);
DragMixin = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({})
], DragMixin);
var DragMixin$1 = DragMixin;

var Drag = /*@__PURE__*/(function (DragMixin) {
    function Drag () {
        DragMixin.apply(this, arguments);
    }if ( DragMixin ) Drag.__proto__ = DragMixin;
    Drag.prototype = Object.create( DragMixin && DragMixin.prototype );
    Drag.prototype.constructor = Drag;

    

    return Drag;
}(DragMixin$1));
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 'div', type: [String, Object, Function] }),
    __metadata("design:type", Object)
], Drag.prototype, "tag", void 0);
Drag = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({})
], Drag);
var script = Drag;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,_vm._g(_vm._b({tag:"component",class:_vm.cssClasses,style:({cursor: _vm.disabled || _vm.handle ? null : 'grab'}),scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(_,slot){return {key:slot,fn:function(scope){return [_vm._t(slot,null,null,scope)]}}})],null,true)},'component',_vm.$attrs,false),_vm.$listeners),[_vm._t("default"),_vm._v(" "),_vm._v(" "),_c('div',{ref:"drag-image",staticClass:"__drag-image"},[_vm._t("drag-image")],2)],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-15f89b5d_0", { source: ".drop-allowed.drop-in *{cursor:inherit!important}.drop-forbidden.drop-in,.drop-forbidden.drop-in *{cursor:no-drop!important}", map: undefined, media: undefined })
,inject("data-v-15f89b5d_1", { source: "html.drag-in-progress *{cursor:grabbing!important}", map: undefined, media: undefined })
,inject("data-v-15f89b5d_2", { source: ".__drag-image[data-v-15f89b5d]{position:fixed;top:-10000px;left:-10000px;will-change:left,top}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-15f89b5d";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Drag$1 = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var DropMixin = /*@__PURE__*/(function (DragAwareMixin) {
    function DropMixin() {
        DragAwareMixin.call(this);
        this.isDrop = true;
    }

    if ( DragAwareMixin ) DropMixin.__proto__ = DragAwareMixin;
    DropMixin.prototype = Object.create( DragAwareMixin && DragAwareMixin.prototype );
    DropMixin.prototype.constructor = DropMixin;

    var prototypeAccessors = { compatibleMode: { configurable: true },dropIn: { configurable: true },typeAllowed: { configurable: true },dropAllowed: { configurable: true },cssClasses: { configurable: true },cssStyle: { configurable: true } };
    DropMixin.prototype.effectiveAcceptsType = function effectiveAcceptsType (type) {
        if (this.acceptsType === null)
            { return true; }
        else if (typeof (this.acceptsType) === 'string')
            { return this.acceptsType === type; }
        else if (typeof (this.acceptsType) === 'object' && Array.isArray(this.acceptsType)) {
            return this.acceptsType.includes(type);
        }
        else {
            return this.acceptsType(type);
        }
    };
    DropMixin.prototype.effectiveAcceptsData = function effectiveAcceptsData (data, type) {
        return this.acceptsData(data, type);
    };
    DropMixin.prototype.created = function created () {
        dnd.on("dragpositionchanged", this.onDragPositionChanged);
        dnd.on("dragtopchanged", this.onDragTopChanged);
        dnd.on("drop", this.onDrop);
    };
    DropMixin.prototype.destroyed = function destroyed () {
        dnd.off("dragpositionchanged", this.onDragPositionChanged);
        dnd.off("dragtopchanged", this.onDragTopChanged);
        dnd.off("drop", this.onDrop);
    };
    DropMixin.prototype.onDragPositionChanged = function onDragPositionChanged (event) {
        if (this === event.top) {
            this.$emit("dragover", event);
        }
    };
    DropMixin.prototype.onDragTopChanged = function onDragTopChanged (event) {
        if (this === event.top) {
            this.$emit("dragenter", event);
        }
        if (this === event.previousTop) {
            this.$emit("dragleave", event);
        }
    };
    DropMixin.prototype.onDrop = function onDrop (event) {
        if (this.dropIn && this.compatibleMode && this.dropAllowed) {
            this.doDrop(event);
        }
    };
    DropMixin.prototype.doDrop = function doDrop (event) {
        this.$emit('drop', event);
        event.source.$emit(this.mode, event);
    };
    DropMixin.prototype.mounted = function mounted () {
        var el = this.$el;
        var comp = this;
        el.addEventListener('easy-dnd-move', onMouseMove);
        function onMouseMove(e) {
            dnd.mouseMove(e, comp);
        }
    };
    prototypeAccessors.compatibleMode.get = function () {
        if (this.dragInProgress) {
            return this.mode === 'copy' || dnd.sourceListeners.hasOwnProperty(this.mode);
        }
        else {
            return null;
        }
    };
    prototypeAccessors.dropIn.get = function () {
        if (this.dragInProgress) {
            return this.dragTop === this;
        }
        else {
            return null;
        }
    };
    prototypeAccessors.typeAllowed.get = function () {
        if (this.dragInProgress) {
            return this.effectiveAcceptsType(this.dragType);
        }
        else {
            return null;
        }
    };
    prototypeAccessors.dropAllowed.get = function () {
        if (this.dragInProgress) {
            if (this.typeAllowed) {
                return this.compatibleMode && this.effectiveAcceptsData(this.dragData, this.dragType);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    prototypeAccessors.cssClasses.get = function () {
        var clazz = {
            'dnd-drop': true
        };
        if (this.dropIn !== null) {
            clazz = Object.assign({}, clazz,
                {"drop-in": this.dropIn,
                "drop-out": !this.dropIn});
        }
        if (this.typeAllowed !== null) {
            clazz = Object.assign({}, clazz,
                {"type-allowed": this.typeAllowed,
                "type-forbidden": !this.typeAllowed});
        }
        if (this.dropAllowed !== null) {
            clazz = Object.assign({}, clazz,
                {"drop-allowed": this.dropAllowed,
                "drop-forbidden": !this.dropAllowed});
        }
        return clazz;
    };
    prototypeAccessors.cssStyle.get = function () {
        if (this.dropAllowed && this.dropIn) {
            return { cursor: this.cursor + ' !important' };
        }
        else {
            return { cursor: 'inherit' };
        }
    };
    /**
     * Returns true if the current drop area participates in the current drag operation.
     */
    DropMixin.prototype.candidate = function candidate (type, data, source) {
        return this.effectiveAcceptsType(type);
    };
    DropMixin.prototype.createDragImage = function createDragImage$1 () {
        var image;
        if (this.$refs['drag-image']) {
            var el = this.$refs['drag-image'];
            if (el.childElementCount !== 1) {
                image = createDragImage(el);
            }
            else {
                image = createDragImage(el.children.item(0));
            }
            image['__opacity'] = this.dragImageOpacity;
        }
        else {
            image = 'source';
        }
        return image;
    };

    Object.defineProperties( DropMixin.prototype, prototypeAccessors );

    return DropMixin;
}(DragAwareMixin$1));
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: function () { return function () { return true; }; }, type: [String, Array, Function] }),
    __metadata("design:type", Object)
], DropMixin.prototype, "acceptsType", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: function () { return function () { return true; }; }, type: Function }),
    __metadata("design:type", Object)
], DropMixin.prototype, "acceptsData", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 'pointer' }),
    __metadata("design:type", String)
], DropMixin.prototype, "cursor", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 'copy' }),
    __metadata("design:type", String)
], DropMixin.prototype, "mode", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 0.7, type: Number }),
    __metadata("design:type", Object)
], DropMixin.prototype, "dragImageOpacity", void 0);
DropMixin = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({}),
    __metadata("design:paramtypes", [])
], DropMixin);
var DropMixin$1 = DropMixin;

var Drop = /*@__PURE__*/(function (DropMixin) {
    function Drop () {
        DropMixin.apply(this, arguments);
    }

    if ( DropMixin ) Drop.__proto__ = DropMixin;
    Drop.prototype = Object.create( DropMixin && DropMixin.prototype );
    Drop.prototype.constructor = Drop;

    var prototypeAccessors = { showDragImage: { configurable: true } };

    prototypeAccessors.showDragImage.get = function () {
        return this.dragInProgress && this.typeAllowed && this.$scopedSlots['drag-image'];
    };

    Object.defineProperties( Drop.prototype, prototypeAccessors );

    return Drop;
}(DropMixin$1));
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 'div', type: [String, Object, Function] }),
    __metadata("design:type", Object)
], Drop.prototype, "tag", void 0);
Drop = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({})
], Drop);
var script$1 = Drop;

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,_vm._g(_vm._b({tag:"component",class:_vm.cssClasses,style:(_vm.cssStyle),scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(_,slot){return {key:slot,fn:function(scope){return [_vm._t(slot,null,null,scope)]}}})],null,true)},'component',_vm.$attrs,false),_vm.$listeners),[_vm._t("default"),_vm._v(" "),_vm._v(" "),(_vm.showDragImage)?_c('div',{ref:"drag-image",staticClass:"__drag-image"},[_vm._t("drag-image",null,{"type":_vm.dragType,"data":_vm.dragData})],2):_vm._e()],2)};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-4eedfece_0", { source: ".drop-allowed.drop-in *{cursor:inherit!important}.drop-forbidden.drop-in,.drop-forbidden.drop-in *{cursor:no-drop!important}", map: undefined, media: undefined })
,inject("data-v-4eedfece_1", { source: ".__drag-image[data-v-4eedfece]{position:fixed;top:-10000px;left:-10000px;will-change:left,top}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = "data-v-4eedfece";
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Drop$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

var DropMask = /*@__PURE__*/(function (DragAwareMixin) {
    function DropMask() {
        DragAwareMixin.apply(this, arguments);
        this.isDropMask = true;
    }

    if ( DragAwareMixin ) DropMask.__proto__ = DragAwareMixin;
    DropMask.prototype = Object.create( DragAwareMixin && DragAwareMixin.prototype );
    DropMask.prototype.constructor = DropMask;
    DropMask.prototype.mounted = function mounted () {
        var el = this.$el;
        var comp = this;
        el.addEventListener('easy-dnd-move', onMouseMove);
        function onMouseMove(e) {
            dnd.mouseMove(e, comp);
        }
    };
    DropMask.prototype.createDragImage = function createDragImage () {
        return 'source';
    };

    return DropMask;
}(DragAwareMixin$1));
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 'div', type: [String, Object, Function] }),
    __metadata("design:type", Object)
], DropMask.prototype, "tag", void 0);
DropMask = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({})
], DropMask);
var script$2 = DropMask;

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,_vm._g(_vm._b({tag:"component",scopedSlots:_vm._u([_vm._l((_vm.$scopedSlots),function(_,slot){return {key:slot,fn:function(scope){return [_vm._t(slot,null,null,scope)]}}})],null,true)},'component',_vm.$attrs,false),_vm.$listeners),[_vm._t("default")],2)};
var __vue_staticRenderFns__$2 = [];

  /* style */
  var __vue_inject_styles__$2 = undefined;
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var DropMask$1 = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

/**
 * This class reacts to drag events emitted by the dnd object to manage a sequence of drag images and fade from one to the
 * other as the drag progresses.
 */
var DragImagesManager = /*@__PURE__*/(function (Vue) {
    function DragImagesManager() {
        Vue.call(this);
        this.selfTransform = null;
        this.clones = null;
        this.source = null;
        this.sourcePos = null;
        this.sourceClone = null;
        dnd.on('dragstart', this.onDragStart);
        dnd.on('dragtopchanged', this.onDragTopChanged);
        dnd.on('dragpositionchanged', this.onDragPositionChanged);
        dnd.on('dragend', this.onDragEnd);
    }

    if ( Vue ) DragImagesManager.__proto__ = Vue;
    DragImagesManager.prototype = Object.create( Vue && Vue.prototype );
    DragImagesManager.prototype.constructor = DragImagesManager;
    DragImagesManager.prototype.onDragStart = function onDragStart (event) {
        this.sourcePos = {
            x: event.source.$el.getBoundingClientRect().left,
            y: event.source.$el.getBoundingClientRect().top
        };
        this.selfTransform = "translate(-" + (event.position.x - this.sourcePos.x) + "px, -" + (event.position.y - this.sourcePos.y) + "px)";
        this.clones = new Map();
        this.source = event.source;
    };
    DragImagesManager.prototype.onDragEnd = function onDragEnd (event) {
        var this$1 = this;

        Vue.nextTick(function () {
            if (!event.success && this$1.source['goBack']) {
                // Restore the drag image that is active when hovering outside any drop zone :
                var img = this$1.switch(null);
                // Move it back to its original place :
                window.requestAnimationFrame(function () {
                    img.style.transition = "all 0.5s";
                    window.requestAnimationFrame(function () {
                        img.style.left = this$1.sourcePos.x + "px";
                        img.style.top = this$1.sourcePos.y + "px";
                        img.style.transform = "translate(0,0)";
                        var handler = function () {
                            this$1.cleanUp();
                            img.removeEventListener("transitionend", handler);
                        };
                        img.addEventListener("transitionend", handler);
                    });
                });
            }
            else {
                this$1.cleanUp();
            }
        });
    };
    DragImagesManager.prototype.cleanUp = function cleanUp () {
        this.clones.forEach(function (clone) {
            clone.remove();
        });
        if (this.sourceClone !== null) {
            this.sourceClone.remove();
        }
        this.selfTransform = null;
        this.clones = null;
        this.source = null;
        this.sourceClone = null;
        this.sourcePos = null;
    };
    DragImagesManager.prototype.onDragTopChanged = function onDragTopChanged (event) {
        this.switch(event.top);
    };
    DragImagesManager.prototype.switch = function switch$1 (top) {
        this.clones.forEach(function (clone) {
            clone.style.opacity = "0";
        });
        if (this.sourceClone) {
            this.sourceClone.style.opacity = "0";
        }
        var activeClone;
        if (top === null) {
            activeClone = this.getSourceClone();
        }
        else {
            if (!this.clones.has(top)) {
                var clone = top['createDragImage'](this.selfTransform);
                if (clone === 'source') {
                    clone = this.getSourceClone();
                }
                else if (clone !== null) {
                    clone.style.opacity = '0';
                    document.body.append(clone);
                }
                this.clones.set(top, clone);
            }
            activeClone = this.clones.get(top);
        }
        if (activeClone !== null) {
            activeClone.offsetWidth; // Forces broswer reflow
            activeClone.style.opacity = activeClone['__opacity'];
            activeClone.style.visibility = 'visible';
        }
        return activeClone;
    };
    DragImagesManager.prototype.getSourceClone = function getSourceClone () {
        if (this.sourceClone === null) {
            this.sourceClone = this.source['createDragImage'](this.selfTransform);
            this.sourceClone.style.opacity = '0';
            document.body.append(this.sourceClone);
        }
        return this.sourceClone;
    };
    DragImagesManager.prototype.onDragPositionChanged = function onDragPositionChanged (event) {
        this.clones.forEach(function (clone) {
            clone.style.left = dnd.position.x + "px";
            clone.style.top = dnd.position.y + "px";
        });
        if (this.sourceClone) {
            this.sourceClone.style.left = dnd.position.x + "px";
            this.sourceClone.style.top = dnd.position.y + "px";
        }
    };

    return DragImagesManager;
}(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Vue"]));
DragImagesManager = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({}) // Necessary to set proper "this" context in event listeners.
    ,
    __metadata("design:paramtypes", [])
], DragImagesManager);
new DragImagesManager();

var DragFeedback = /*@__PURE__*/(function (Vue) {
    function DragFeedback () {
        Vue.apply(this, arguments);
    }if ( Vue ) DragFeedback.__proto__ = Vue;
    DragFeedback.prototype = Object.create( Vue && Vue.prototype );
    DragFeedback.prototype.constructor = DragFeedback;

    

    return DragFeedback;
}(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Vue"]));
DragFeedback = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({})
], DragFeedback);
var script$3 = DragFeedback;

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"DragFeedback"},[_vm._t("default")],2)};
var __vue_staticRenderFns__$3 = [];

  /* style */
  var __vue_inject_styles__$3 = undefined;
  /* scoped */
  var __vue_scope_id__$3 = "data-v-0589f3cb";
  /* module identifier */
  var __vue_module_identifier__$3 = undefined;
  /* functional template */
  var __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var DragFeedback$1 = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

var Grid = function Grid(collection, upToIndex, row, fromIndex) {
    this.magnets = [];
    var index = 0;
    for (var i = 0, list = collection; i < list.length; i += 1) {
        var child = list[i];

        if (index > upToIndex)
            { break; }
        var rect = child.getBoundingClientRect();
        var hasNestedDrop = child.classList.contains("dnd-drop") || child.getElementsByClassName("dnd-drop").length > 0;
        var horizontal = null;
        if (hasNestedDrop) {
            if (row === 'auto') {
                // Auto mode not supported for now. Row or column must be defined explicitly if there are nested drop lists.
                throw new Error("Easy-DnD error : a drop list is missing one of these attributes : 'row' or 'column'.");
            }
            else {
                horizontal = row === 'row';
            }
        }
        if (fromIndex === null) {
            // Inserting mode.
            this.magnets.push(hasNestedDrop ? this.before(rect, horizontal) : this.center(rect));
        }
        else {
            // Reordering mode.
            this.magnets.push(hasNestedDrop ? (fromIndex < index ? this.after : this.before)(rect, horizontal) : this.center(rect));
        }
        // Debug : show magnets :
        //document.body.insertAdjacentHTML("beforeend", "<div style='background-color: red; position: fixed; width: 1px; height: 1px; top:" + this.magnets[index].y + "px; left:" + this.magnets[index].x + "px;' ></div>")
        index++;
    }
};
/**
 * Returns the center of the rectangle.
 */
Grid.prototype.center = function center (rect) {
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
};
/**
 * When horizontal is true / false, returns middle of the left / top side of the rectangle.
 */
Grid.prototype.before = function before (rect, horizontal) {
    return horizontal ? {
        x: rect.left,
        y: rect.top + rect.height / 2
    } : {
        x: rect.left + rect.width / 2,
        y: rect.top
    };
};
/**
 * When horizontal is true / false, returns middle of the right / bottom side of the rectangle.
 */
Grid.prototype.after = function after (rect, horizontal) {
    return horizontal ? {
        x: rect.left + rect.width,
        y: rect.top + rect.height / 2
    } : {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height
    };
};
Grid.prototype.closestIndex = function closestIndex (position) {
    var minDist = 999999;
    var index = -1;
    for (var i = 0; i < this.magnets.length; i++) {
        var magnet = this.magnets[i];
        var dist = Math.sqrt(Math.pow(magnet.x - position.x, 2) + Math.pow(magnet.y - position.y, 2));
        if (dist < minDist) {
            minDist = dist;
            index = i;
        }
    }
    return index;
};

var DnDEvent = function DnDEvent () {};
var ReorderEvent = function ReorderEvent(from, to) {
    this.from = from;
    this.to = to;
};
ReorderEvent.prototype.apply = function apply (array) {
    var tmp = array[this.from];
    array.splice(this.from, 1);
    array.splice(this.to, 0, tmp);
};
var InsertEvent = function InsertEvent(type, data, index) {
    this.type = type;
    this.data = data;
    this.index = index;
};

var DropList = /*@__PURE__*/(function (DropMixin) {
    function DropList() {
        DropMixin.apply(this, arguments);
        this.grid = null;
        this.forbiddenKeys = [];
        this.feedbackKey = null;
        this.fromIndex = null;
    }

    if ( DropMixin ) DropList.__proto__ = DropMixin;
    DropList.prototype = Object.create( DropMixin && DropMixin.prototype );
    DropList.prototype.constructor = DropList;

    var prototypeAccessors = { rootTag: { configurable: true },rootProps: { configurable: true },rootListeners: { configurable: true },direction: { configurable: true },reordering: { configurable: true },closestIndex: { configurable: true },dropAllowed: { configurable: true },itemsBeforeFeedback: { configurable: true },itemsAfterFeedback: { configurable: true },itemsBeforeReorderingFeedback: { configurable: true },itemsAfterReorderingFeedback: { configurable: true },reorderedItems: { configurable: true },clazz: { configurable: true },style: { configurable: true },showDragFeedback: { configurable: true },showInsertingDragImage: { configurable: true },showReorderingDragImage: { configurable: true },hasReorderingFeedback: { configurable: true } };
    prototypeAccessors.rootTag.get = function () {
        if (this.noAnimations) {
            return this.tag ? this.tag : 'div';
        }
        else {
            return "transition-group";
        }
    };
    prototypeAccessors.rootProps.get = function () {
        if (this.noAnimations) {
            return this.$attrs;
        }
        else {
            return {
                tag: this.tag,
                duration: { enter: 0, leave: 0 },
                css: false
            };
        }
    };
    prototypeAccessors.rootListeners.get = function () {
        if (this.noAnimations) {
            return this.$listeners;
        }
        else {
            return {};
        }
    };
    DropList.prototype.created = function created () {
        dnd.on("dragstart", this.onDragStart);
        dnd.on("dragend", this.onDragEnd);
    };
    prototypeAccessors.direction.get = function () {
        if (this.row)
            { return 'row'; }
        if (this.column)
            { return 'column'; }
        return 'auto';
    };
    DropList.prototype.destroyed = function destroyed () {
        dnd.off("dragstart", this.onDragStart);
        dnd.off("dragend", this.onDragEnd);
    };
    DropList.prototype.onDragStart = function onDragStart (event) {
        var this$1 = this;

        if (this.candidate(dnd.type, dnd.data, dnd.source)) {
            if (this.reordering) {
                this.fromIndex = Array.prototype.indexOf.call(event.source.$el.parentElement.children, event.source.$el);
                this.grid = this.computeReorderingGrid();
            }
            else {
                this.$nextTick(function () {
                    // Presence of feedback node in the DOM and of keys in the virtual DOM required => delayed until what
                    // depends on drag data has been processed.
                    this$1.grid = this$1.computeInsertingGrid();
                    this$1.feedbackKey = this$1.computeFeedbackKey();
                    this$1.forbiddenKeys = this$1.computeForbiddenKeys();
                });
            }
        }
    };
    DropList.prototype.onDragEnd = function onDragEnd () {
        this.fromIndex = null;
        this.feedbackKey = null;
        this.forbiddenKeys = null;
        this.grid = null;
    };
    prototypeAccessors.reordering.get = function () {
        if (dnd.inProgress) {
            return dnd.source.$el.parentElement === this.$el && this.$listeners.hasOwnProperty('reorder');
        }
        else {
            return null;
        }
    };
    prototypeAccessors.closestIndex.get = function () {
        if (this.grid) {
            return this.grid.closestIndex(dnd.position);
        }
        else {
            return null;
        }
    };
    prototypeAccessors.dropAllowed.get = function () {
        if (this.dragInProgress) {
            if (this.reordering) {
                return this.items.length > 1;
            }
            else {
                var superDropAllowed = DropMixin['options'].computed.dropAllowed.get.call(this);
                if (!superDropAllowed) {
                    return false;
                }
                else {
                    if (this.forbiddenKeys !== null && this.feedbackKey !== null) {
                        return !this.forbiddenKeys.includes(this.feedbackKey);
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        else {
            return null;
        }
    };
    prototypeAccessors.itemsBeforeFeedback.get = function () {
        if (this.closestIndex === 0) {
            return [];
        }
        else {
            return this.items.slice(0, this.closestIndex);
        }
    };
    prototypeAccessors.itemsAfterFeedback.get = function () {
        if (this.closestIndex === this.items.length) {
            return [];
        }
        else {
            return this.items.slice(this.closestIndex);
        }
    };
    prototypeAccessors.itemsBeforeReorderingFeedback.get = function () {
        if (this.closestIndex <= this.fromIndex) {
            return this.items.slice(0, this.closestIndex);
        }
        else {
            return this.items.slice(0, this.closestIndex + 1);
        }
    };
    prototypeAccessors.itemsAfterReorderingFeedback.get = function () {
        if (this.closestIndex <= this.fromIndex) {
            return this.items.slice(this.closestIndex);
        }
        else {
            return this.items.slice(this.closestIndex + 1);
        }
    };
    prototypeAccessors.reorderedItems.get = function () {
        var toIndex = this.closestIndex;
        var reordered = [].concat( this.items );
        var temp = reordered[this.fromIndex];
        reordered.splice(this.fromIndex, 1);
        reordered.splice(toIndex, 0, temp);
        return reordered;
    };
    prototypeAccessors.clazz.get = function () {
        return Object.assign({}, {'drop-list': true,
            'reordering': this.reordering === true,
            'inserting': this.reordering === false},
            (this.reordering === false ? this.cssClasses : { 'dnd-drop': true }));
    };
    prototypeAccessors.style.get = function () {
        return Object.assign({}, (this.reordering === false ? this.cssStyle : {}));
    };
    prototypeAccessors.showDragFeedback.get = function () {
        return this.dragInProgress && this.typeAllowed && !this.reordering;
    };
    prototypeAccessors.showInsertingDragImage.get = function () {
        return this.dragInProgress && this.typeAllowed && !this.reordering && this.$scopedSlots.hasOwnProperty("drag-image");
    };
    prototypeAccessors.showReorderingDragImage.get = function () {
        return this.dragInProgress && this.reordering && this.$scopedSlots.hasOwnProperty("reordering-drag-image");
    };
    DropList.prototype.doDrop = function doDrop (event) {
        if (this.reordering) {
            if (this.fromIndex !== this.closestIndex) {
                this.$emit('reorder', new ReorderEvent(this.fromIndex, this.closestIndex));
            }
        }
        else {
            DropMixin['options'].methods.doDrop.call(this, event);
            this.$emit('insert', new InsertEvent(event.type, event.data, this.closestIndex));
        }
    };
    DropList.prototype.candidate = function candidate (type, data, source) {
        var i = arguments.length, argsArray = Array(i);
        while ( i-- ) argsArray[i] = arguments[i];
        var ref;

        var superCandidate = (ref = DropMixin['options'].methods.candidate).call.apply(ref, [ this ].concat( argsArray ));
        return (superCandidate && (this.$listeners.hasOwnProperty("insert") || this.$listeners.hasOwnProperty("drop"))) || this.reordering;
    };
    DropList.prototype.computeForbiddenKeys = function computeForbiddenKeys () {
        var vnodes = this.noAnimations ? [] : this.$children[0].$vnode.context.$children[0].$slots.default;
        return vnodes
            .map(function (vn) { return vn.key; })
            .filter(function (k) { return k !== undefined && k !== 'drag-image' && k !== 'drag-feedback'; });
    };
    DropList.prototype.computeFeedbackKey = function computeFeedbackKey () {
        return this.$refs['feedback']['$slots']['default'][0]['key'];
    };
    prototypeAccessors.hasReorderingFeedback.get = function () {
        return this.$scopedSlots.hasOwnProperty("reordering-feedback");
    };
    DropList.prototype.computeInsertingGrid = function computeInsertingGrid () {
        var feedbackParent = this.$refs['feedback']['$el'];
        var feedback = feedbackParent.children[0];
        var clone = feedback.cloneNode(true);
        var tg = this.$el;
        if (tg.children.length > this.items.length) {
            tg.insertBefore(clone, tg.children[this.items.length]);
        }
        else {
            tg.append(clone);
        }
        var grid = new Grid(tg.children, this.items.length, this.direction, null);
        clone.remove();
        return grid;
    };
    DropList.prototype.computeReorderingGrid = function computeReorderingGrid () {
        var tg = this.$el;
        return new Grid(tg.children, this.items.length - 1, this.direction, this.fromIndex);
    };
    DropList.prototype.createDragImage = function createDragImage$1 () {
        var image;
        if (this.$refs['drag-image']) {
            var el = this.$refs['drag-image'];
            var model;
            if (el.childElementCount !== 1) {
                model = el;
            }
            else {
                model = el.children.item(0);
            }
            var clone = model.cloneNode(true);
            var tg = this.$el;
            tg.append(clone);
            image = createDragImage(clone);
            clone.remove();
            image['__opacity'] = this.dragImageOpacity;
        }
        else {
            image = 'source';
        }
        return image;
    };

    Object.defineProperties( DropList.prototype, prototypeAccessors );

    return DropList;
}(DropMixin$1));
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: 'div', type: [String, Object, Function] }),
    __metadata("design:type", Object)
], DropList.prototype, "tag", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])(),
    __metadata("design:type", Array)
], DropList.prototype, "items", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: null }),
    __metadata("design:type", Boolean)
], DropList.prototype, "row", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: null, type: Boolean }),
    __metadata("design:type", Boolean)
], DropList.prototype, "column", void 0);
__decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Prop"])({ default: false, type: Boolean }),
    __metadata("design:type", Boolean)
], DropList.prototype, "noAnimations", void 0);
DropList = __decorate([
    Object(vue_property_decorator__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        components: { DragFeedback: DragFeedback$1 }
    })
], DropList);
var script$4 = DropList;

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.rootTag,_vm._g(_vm._b({tag:"component",class:_vm.clazz,style:(_vm.style)},'component',_vm.rootProps,false),_vm.rootListeners),[(_vm.dropIn && _vm.dropAllowed)?[(_vm.reordering)?[(_vm.hasReorderingFeedback)?[_vm._l((_vm.itemsBeforeReorderingFeedback),function(item){return _vm._t("item",null,{"item":item})}),_vm._v(" "),_vm._t("reordering-feedback",null,{"item":_vm.items[_vm.fromIndex]}),_vm._v(" "),_vm._l((_vm.itemsAfterReorderingFeedback),function(item){return _vm._t("item",null,{"item":item})})]:[_vm._l((_vm.reorderedItems),function(item,index){return _vm._t("item",null,{"item":item,"reorder":index === _vm.closestIndex})})]]:[_vm._l((_vm.itemsBeforeFeedback),function(item){return _vm._t("item",null,{"item":item,"reorder":false})}),_vm._v(" "),_vm._t("feedback",null,{"data":_vm.dragData,"type":_vm.dragType}),_vm._v(" "),_vm._l((_vm.itemsAfterFeedback),function(item){return _vm._t("item",null,{"item":item,"reorder":false})})]]:[_vm._l((_vm.items),function(item){return _vm._t("item",null,{"item":item,"reorder":false})})],_vm._v(" "),(_vm.showDragFeedback)?_c('drag-feedback',{key:"drag-feedback",ref:"feedback",staticClass:"__feedback"},[_vm._t("feedback",null,{"data":_vm.dragData,"type":_vm.dragType})],2):_vm._e(),_vm._v(" "),(_vm.showInsertingDragImage)?_c('div',{key:"inserting-drag-image",ref:"drag-image",staticClass:"__drag-image"},[_vm._t("drag-image",null,{"type":_vm.dragType,"data":_vm.dragData})],2):_vm._e(),_vm._v(" "),(_vm.showReorderingDragImage)?_c('div',{key:"reordering-drag-image",ref:"drag-image",staticClass:"__drag-image"},[_vm._t("reordering-drag-image",null,{"item":_vm.items[_vm.fromIndex]})],2):_vm._e(),_vm._v(" "),_c('div',{key:"drop-list-content"},[_vm._t("default")],2)],2)};
var __vue_staticRenderFns__$4 = [];

  /* style */
  var __vue_inject_styles__$4 = function (inject) {
    if (!inject) { return }
    inject("data-v-56f28757_0", { source: ".drop-list[data-v-56f28757]>*{transition:transform .2s}.__feedback[data-v-56f28757]{display:none}.__drag-image[data-v-56f28757]{position:fixed;top:-10000px;left:-10000px;will-change:left,top}", map: undefined, media: undefined })
,inject("data-v-56f28757_1", { source: ".drop-allowed.drop-in *{cursor:inherit!important}.drop-forbidden.drop-in,.drop-forbidden.drop-in *{cursor:no-drop!important}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$4 = "data-v-56f28757";
  /* module identifier */
  var __vue_module_identifier__$4 = undefined;
  /* functional template */
  var __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var DropList$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );




/***/ }),

/***/ "./node_modules/vue-property-decorator/lib/vue-property-decorator.js":
/*!***************************************************************************!*\
  !*** ./node_modules/vue-property-decorator/lib/vue-property-decorator.js ***!
  \***************************************************************************/
/*! exports provided: Component, Vue, Mixins, Inject, InjectReactive, Provide, ProvideReactive, Model, Prop, PropSync, Watch, Emit, Ref */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Inject", function() { return Inject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InjectReactive", function() { return InjectReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Provide", function() { return Provide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProvideReactive", function() { return ProvideReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Model", function() { return Model; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Prop", function() { return Prop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PropSync", function() { return PropSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Watch", function() { return Watch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Emit", function() { return Emit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ref", function() { return Ref; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "Vue", function() { return vue__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-class-component */ "./node_modules/vue-class-component/dist/vue-class-component.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return vue_class_component__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Mixins", function() { return vue_class_component__WEBPACK_IMPORTED_MODULE_1__["mixins"]; });

/** vue-property-decorator verson 8.5.1 MIT LICENSE copyright 2020 kaorun343 */
/// <reference types='reflect-metadata'/>




/** Used for keying reactive provide/inject properties */
var reactiveInjectKey = '__reactiveInject__';
/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
function Inject(options) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
/**
 * decorator of a reactive inject
 * @param from key
 * @return PropertyDecorator
 */
function InjectReactive(options) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            var fromKey_1 = !!options ? options.from || options : key;
            var defaultVal_1 = (!!options && options.default) || undefined;
            if (!componentOptions.computed)
                componentOptions.computed = {};
            componentOptions.computed[key] = function () {
                var obj = this[reactiveInjectKey];
                return obj ? obj[fromKey_1] : defaultVal_1;
            };
            componentOptions.inject[reactiveInjectKey] = reactiveInjectKey;
        }
    });
}
function produceProvide(original) {
    var provide = function () {
        var _this = this;
        var rv = typeof original === 'function' ? original.call(this) : original;
        rv = Object.create(rv || null);
        // set reactive services (propagates previous services if necessary)
        rv[reactiveInjectKey] = this[reactiveInjectKey] || {};
        for (var i in provide.managed) {
            rv[provide.managed[i]] = this[i];
        }
        var _loop_1 = function (i) {
            rv[provide.managedReactive[i]] = this_1[i]; // Duplicates the behavior of `@Provide`
            Object.defineProperty(rv[reactiveInjectKey], provide.managedReactive[i], {
                enumerable: true,
                get: function () { return _this[i]; },
            });
        };
        var this_1 = this;
        for (var i in provide.managedReactive) {
            _loop_1(i);
        }
        return rv;
    };
    provide.managed = {};
    provide.managedReactive = {};
    return provide;
}
function needToProduceProvide(original) {
    return (typeof original !== 'function' ||
        (!original.managed && !original.managedReactive));
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (needToProduceProvide(provide)) {
            provide = componentOptions.provide = produceProvide(provide);
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of a reactive provide
 * @param key key
 * @return PropertyDecorator | void
 */
function ProvideReactive(key) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        var provide = componentOptions.provide;
        // inject parent reactive services (if any)
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject = componentOptions.inject || {};
            componentOptions.inject[reactiveInjectKey] = {
                from: reactiveInjectKey,
                default: {},
            };
        }
        if (needToProduceProvide(provide)) {
            provide = componentOptions.provide = produceProvide(provide);
        }
        provide.managedReactive[k] = key || k;
    });
}
/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
var reflectMetadataIsSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined';
function applyMetadata(options, target, key) {
    if (reflectMetadataIsSupported) {
        if (!Array.isArray(options) &&
            typeof options !== 'function' &&
            typeof options.type === 'undefined') {
            var type = Reflect.getMetadata('design:type', target, key);
            if (type !== Object) {
                options.type = type;
            }
        }
    }
}
/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        applyMetadata(options, target, key);
        Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
            ;
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
            componentOptions.model = { prop: k, event: event || k };
        })(target, key);
    };
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        applyMetadata(options, target, key);
        Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
            ;
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}
/**
 * decorator of a synced prop
 * @param propName the name to interface with from outside, must be different from decorated property
 * @param options the options for the synced prop
 * @return PropertyDecorator | void
 */
function PropSync(propName, options) {
    if (options === void 0) { options = {}; }
    // @ts-ignore
    return function (target, key) {
        applyMetadata(options, target, key);
        Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
            ;
            (componentOptions.props || (componentOptions.props = {}))[propName] = options;
            (componentOptions.computed || (componentOptions.computed = {}))[k] = {
                get: function () {
                    return this[propName];
                },
                set: function (value) {
                    // @ts-ignore
                    this.$emit("update:" + propName, value);
                },
            };
        })(target, key);
    };
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        var watch = componentOptions.watch;
        if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
            watch[path] = [watch[path]];
        }
        else if (typeof watch[path] === 'undefined') {
            watch[path] = [];
        }
        watch[path].push({ handler: handler, deep: deep, immediate: immediate });
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (_target, propertyKey, descriptor) {
        var key = hyphenate(propertyKey);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var emit = function (returnValue) {
                var emitName = event || key;
                if (returnValue === undefined) {
                    if (args.length === 0) {
                        _this.$emit(emitName);
                    }
                    else if (args.length === 1) {
                        _this.$emit(emitName, args[0]);
                    }
                    else {
                        _this.$emit.apply(_this, [emitName].concat(args));
                    }
                }
                else {
                    if (args.length === 0) {
                        _this.$emit(emitName, returnValue);
                    }
                    else if (args.length === 1) {
                        _this.$emit(emitName, returnValue, args[0]);
                    }
                    else {
                        _this.$emit.apply(_this, [emitName, returnValue].concat(args));
                    }
                }
            };
            var returnValue = original.apply(this, args);
            if (isPromise(returnValue)) {
                returnValue.then(emit);
            }
            else {
                emit(returnValue);
            }
            return returnValue;
        };
    };
}
/**
 * decorator of a ref prop
 * @param refKey the ref key defined in template
 */
function Ref(refKey) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (options, key) {
        options.computed = options.computed || {};
        options.computed[key] = {
            cache: false,
            get: function () {
                return this.$refs[refKey || key];
            },
        };
    });
}
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}


/***/ })

}]);