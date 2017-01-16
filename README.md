# vue-storage

A websocket based remote event system for [Vue.js](http://vuejs.org).

Works with `Vue 2.0`, untested with `Vue 1.0`.

## Installation

##### 1.) Install package via NPM
```
npm install vue-storage
```

##### 2.) Activate plugin within project.
```
import Vue from 'vue';
import VueStorage from 'vue-storage';

Vue.use(
    VueStorage
)
```

or

```
window.Vue = require('vue');
const VueStorage = require('vue-storage');

Vue.use(
    VueStorage
)
```

## Usage

#### The `Vue.Storage` global object.
This plugin provides a direct interface into the data storage client abstracting localStorage or browser cookies.

#### The `storage` component object
This plugin provides a mixin object `storage` which allows for an attachment of data values to the storage class pulling storage values on creation and watching for changes.

#### Storing Data elements
```
...
    Vue.Storage.setItem(name, value);

    new Vue({
        data: {
            value: "defaultValue"
        },
        storage: {
            "value"
        }
    })
...
```

#### Retrieving Data elements
If `defaultValue` is not set it will return null if `name` is not in storage.
```
...
    Vue.Storage.getItem(name, defaultValue);
...
```

## License

[MIT](http://opensource.org/licenses/MIT)
