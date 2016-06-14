# ae-to-f1

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This is an After Effects to `f1` exporter. There is a companion module [ae-to-f1](https://github.com/Jam3/ae-to-f1) which is used on the frontend and contains all logic that will be shared by all exported After Effects `f1` instances.

In other words the workflow for the exporter will be to export the After Effects component and then in the project install `ae-to-f1`.

When using this exporter it's a two step process where you first run `ae-to-json` after which you can run this exporter on the exporter JSON file.

## Usage

[![NPM](https://nodei.co/npm/ae-to-f1.png)](https://www.npmjs.com/package/ae-to-f1)

When using this exporter you should use one of the "flavours" of `f1` by using one of the following

```javascript
require('ae-to-f1-exporter/exporters/react-f1')
require('ae-to-f1-exporter/exporters/f1-dom')
```

The following in example of how to use the exporter for `f1-dom` and the process for other flavours of `f1` exporters will be exactly the same:

```javascript
var exporterF1Dom = require('../../exporters/react-f1');

exporterF1Dom({
  pathJSON: './ae-to-json-export.json',
  pathOut: './out_put/'
});
```

In the above example `pathJSON` would be a JSON file which is exported from After Effects using the [`ae-to-json`](https://github.com/jam3/ae-to-json) module. `pathOut` should be a path to a folder your files will be exported to.

Three files will be exported to the `pathOut` folder:

1. `index.js` - This file is where the main logic of the exported ui exists. The contents of this file will be depedent on which platform you're targetting. For `f1-dom` this module would export a function which will return a `f1` instance. For `react-f1` a `react-f1` component will be returned.
2. `animation.json` - This file contains parsed animation data from the `ae-to-json` exported file. `animation.json` will be the exact same on each platform. This json file is structured in a way where each UI "static/non-animated" and "animated" properties are split so that it's easier for developers to potentially manually by hand modify animation propertes.
3. `targets.json` - is a meta-data file which contains information about the items being animated such as image sizes and file names.


## Testing

This exporter includes two "flavours" of `f1`. To run tests for the different flavours use the following commands:

`react-f1`:
```
$ npm run test-react-f1
```

`f1-dom`:
```
$ npm run test-f1-dom
```

These two tests will generate/export ui components that will run at the address [http://localhost:8000](http://localhost:8000)

The generated test files will exist in:

`f1-dom`:
```
test/
-- f1-dom/
---- test-f1-dom/
```

and for `react-f1`:
```
test/
-- react-f1/
---- test-react-f1/
```

## License

MIT, see [LICENSE.md](http://github.com/mikkoh/ae-to-f1/blob/master/LICENSE.md) for details.
