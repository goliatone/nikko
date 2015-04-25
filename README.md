# nikko

Nikko, the Winged Monkey King. Also a node port of toto.

## Getting Started
Install the module with: `npm install nikko -g`

## Documentation

`$ nikko create <name>`
Generates a blog using the `default` blueprint. It will us the current directory. Once created it will also create a local `.nikkorc` and add the project to the a list of projects in `~/.nikko/projects`.

After it has generated all files, it will call build.

`$ nikko build`
Compiles the templates and generates a static site. It uses `librarian` by default. The blueprint contains a `librarian.json` file that manages the build process. It uses a set of default parameters, stored in the `.nikkorc` that provided we are calling commands from the project directory it all should work.
If not, we should specify the project's name|id.

`$nikko serve`
Serves a preview site on port **9393** by default. It will watch the **src** directory and trigger builds when source files change, which in turn trigger a **live reload** event.

## Examples
_(Coming soon)_

## Todo

Commands:
create => new
new => generate
build
serve
install
publish

* Commands should have a post hook, chain. If we create new, we should build after.
* Commands should be installable via `npm`. 

nikko:
- It should load configuration.
- It should build context.
    - We should be able to know if we are on a nikko project dir
    - When we create a new project, we want to collect metadata.
- It should start a new IPC server, Unix socket, `/tmp/nikko.<project>.sock`
- We should be able to trigger commands using the server


We should be able to list all projects locally

We should be able to config rc

TODO: move commands to plugins directory instead of lib

## Plugins
Installed globally, available to the global nikko instance.
Each plugin should be published as a separate npm module.
It should have a predefined directory layout:

- nikko-{plugin}
    | bin -> nikko-{plugin}
    | index.js

It will be copied over to the `plugins` directory.
The bin file will be included in the `bin` directory.
The plugin will be registered in the package.json/.nikkorc config file


## Blueprints
Skeleton of a site, which content is compiled against generating the static output.
Blueprints should provide info on which directories are targets for:
- `new`: ie _posts
- `build`: -s src 

We should be able to install blueprints.

## RC
* build: 
    - '-s, --source [directory]', 'Source directory'
* create:
    - '-t, --target-directory [directory]', 'Target directory'
    - '-T, --template [template]', 'Template', 'default' <= rename to -b --blueprint

## Themes
How do we decouple themes from blueprints? We should be able to install both independently.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 goliatone  
Licensed under the MIT license.
