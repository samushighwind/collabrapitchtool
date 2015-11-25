To build: run `npm run build`.

To install in your project:
`npm install --save git+ssh://git@bitbucket.org/collabra/react-pitch-tool.git`

Also be sure all peer dependencies are installed in your project:
`npm install --save react react-dom classnames soundfont-player`

After installing this module in your project, add the following to your file:

1. At the top, either `var PitchTool = require('react-pitch-tool');` or `import PitchTool from 'react-pitch-tool';`
2. In your JSX, include the component like so: `<PitchTool width='320px' includeVisibilityToggle={ true } />`
3. Be sure to include the css file for the PitchTool component: 'react-pitch-tool/dist/bundle.css'.

Configuration:

The PitchTool component accepts three optional props: `width`, `height`, and `includeVisibilityToggle`.

`includeVisibilityToggle` should be true if you want to include a button that opens and closes the pitch tool below it. Otherwise, exclude this prop.

`width` and `height` are optional. Each accepts either a float/integer value (for pixels) or a string with any valid CSS distance value (`px`, `em`, `%`, `vmax`, etc.), except for the calc() function.

By default, if neither `width` nor `height` is supplied, the pitch tool will take up 100% of the parent container. However, this is will result in undesirable behavior if the visibility toggle is activated.

If only one value (`width` or `height`) is given, the other will automatically be adjusted so that the `width == height * 3`. That is, unless the supplied value is in `%` units, which are axis-dependent. In that case, the unsupplied value will continue to be 100% of the parent.
