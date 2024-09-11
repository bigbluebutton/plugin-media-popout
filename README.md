# Media Popout Plugin

## Description

This plugins adds a button in the top right corner of Webcams and Screenshare to allow the video stream to be opened in a new window.

![Gif of plugin demo](./public/assets/plugin.gif)

## Running the Plugin From Source Code

1. Start the development server:

```bash
npm install
npm start
```

2. Add this to the `settings.yml` of the BBB HTML5-client:
```yaml
public:
  plugins:
    - name: MediaPopoutPlugin
      url: <<PLUGIN_URL>>
```

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
npm install
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `MediaPopoutPlugin.js`. This file can be hosted on any HTTPS server.

Alternatively, you can host the bundled file on the BigBlueButton server by copying dist/TourPlugin.js to the folder /var/www/bigbluebutton-default/assets/plugins. In this case, the <<PLUGIN_URL>> will be https://<your-host>/plugins/MediaPopoutPlugin.js.

## Background

BigBlueButton added supports for plugins in 2024 with BBB 3.0.
Check the official [documentation website](https://docs.bigbluebutton.org) for more information.

This plugin repository was created using the plugin [template repository for BigBlueButton](https://github.com/bigbluebutton/plugin-template) hosted on GitHub.
