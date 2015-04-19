# nikko

Nikko, the Winged Monkey King. Also a node port of toto.

## Getting Started
Install the module with: `npm install nikko -g`

## Documentation
_(Coming soon)_

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

Commands should have a post hook, chain. If we create new, we should build after.

nikko:
- It should load configuration.
- It should build context.
    - We should be able to know if we are on a nikko project dir
    - When we create a new project, we want to collect metadata.
- It should start a new IPC server, Unix socket, `/tmp/nikko.<project>.sock`
- We should be able to trigger commands using the server


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 goliatone  
Licensed under the MIT license.
