# Libé Utils

## General purpose

This library contains some simple helper functions, used server-side or client-side.

Home repo: https://github.com/libe-max/libe-utils<br/>
NPM: https://www.npmjs.com/package/libe-utils

## Technologies

Plain javascript functions. The idea is to circumvent the use of external dependencies, so keep it simple.

## Install, install as a dependency & publish

#### Install

```bash
# Go to your favorite location
> cd /wherever/you/want/

# Clone libe-utils
> git clone https://github.com/libe-max/libe-utils.git

# No dependencies, you're ready
```

#### Install as a dependency

```bash
# Go to your project
> cd /wherever/your/project/is
> npm i libe-utils
```

#### Publish

```bash
> cd /wherever/you/installed/libe-utils/

# Commit and push everything
> git add *
> git commit -m "some lowercase descriptive action text"
> git push origin master

# Update "version" field in package.json, according to the [semantic versionning](https://semver.org/) method.
> nano package.json

# Install dependencies again in order to update package-lock.json
> npm i

# Commit & push version change
> git add *
> git commit -m "v{MAJOR}.{MINOR}.{PATCH}"
> git push origin master

# Publish to NPM (no need to build)
> npm publish
```


## Contents

```
libe-components
├── package.json
├── package-lock.json
├── index.js
├── get-closest-dom-parent.js
├── parse-cookies.js
├── parse-tsv.js
```

| Path                   | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `/package.json`        | The ID card of the project                                   |
| `/package-lock.json`   | Don't touch this                                             |
| `/index.js`            | Imports all the files of the folder, and makes module exports accessible via `import { someUtil } from 'libe-utils'`|
| `/get-closest-dom-parent.js`| From an element in document, finds its closest parent matching the given selector. Returns an element|
| `/parse-cookies.js`    | Parses cookies in current page, and returns them as an object litteral|
| `/parse-tsv.js`        | From a TSV input and a n length array description of tabs widths, returns n arrays of object literals. First line is assumed to be the labels|


## Use

```jsx
import { parseTsv } from 'libe-utils'

const tsv = `
id \t name   \t favorites_albums \t id \t album_name                       \t artist_name  \n
1  \t Alice  \t 1, 2             \t 1  \t In the court of the Crimson King \t King Crimson \n
2  \t Bob    \t 2, 3             \t 2  \t Five Leaves Left                 \t Nick Drake   \n
3  \t Clara  \t 1, 3             \t 3  \t Straight Outta Compton           \t N.W.A        \n
`

const parsed = parseTsv(tsv, [3, 3])
console.log(parsed)

/* Prints :
 * [
 *   [
 *     { id: '1', name: 'Alice', favorites_albums: '1, 2' },
 *     { id: '2', name: 'Bob',   favorites_albums: '2, 3' },
 *     { id: '2', name: 'Clara', favorites_albums: '1, 3' }
 *   ], [
 *     { id: '1', album_name: 'In the court of the Crimson King', artist_name: 'King Crimson' },
 *     { id: '2', album_name: 'Five Leaves Left',                 artist_name: 'Nick Drake'   },
 *     { id: '2', album_name: 'Straight Outta Compton',           artist_name: 'N.W.A'        }
 *   ]
 * ]
 */

```

## Auteurs

- **Maxime Fabas** - _Rédaction_ - [maximefabas.github.io](https://maximefabas.github.io)

___
![Logo Libération](https://www.liberation.fr/apps/static/assets/liberation-logo_raster_64.png)       ![Logo Libé labo](https://www.liberation.fr/apps/static/assets/libe-labo-logo_raster_64.png)



