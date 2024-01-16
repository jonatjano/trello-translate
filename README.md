# trelloTranslatedMirror

Automatically translate a trello board into other boards

## set up

### create config file
Duplicate `configTemplate.js` into a new file named `config.js` and replace the placeholders with your actual configurations
The format of the file is fully explained in the jsDoc of `configTemplate.js`

### api token
You'll need a trelloAuthToken that you can get on https://trello.com/app-key

Translation is currently only supported with deepL, you can get your token here: https://www.deepl.com/pro-account/plan

## running
Run using `npm start`

On first run the soft will create a new board for each target language set in config, it will also create a `.cache` file which stores id correspondence between the original board and the translated board