# Github Team Reviewer [![Build Status](https://api.travis-ci.org/M6Web/GithubTeamReviewer.png?branch=master)](http://travis-ci.org/M6Web/GithubTeamReviewer)

A monitoring tool that allows you to quickly view all Github pull requests of your teams and their statuses.

![Github Team Reviewer](http://imagizer.imageshack.us/a/img674/2445/PYOJnf.png "Github Team Reviewer")

## Installation

#### Clone the project

```shell
$ git clone https://github.com/M6Web/GithubTeamReviewer.git
$ cd GithubTeamReviewer
```

#### Install dependencies

```shell
$ npm install -g bower gulp
$ npm install
$ bower install
```

## Configuration

Please configure a new `config/config.json` file from [`config/config.json.dist`](config/config.json.dist).

Options :

* **refreshInterval** : time between 2 dashboard updates (be careful with low interval because you can reach API rate limit quickly),
* **teams** : list of teams, keys are teams names and you can define these properties for each :
  * *members* : an array of Github usernames,
  * *org* : an array of Github organizations,
  * *apiUrl* : url of your Github API (optional, default is `https://api.github.com`),
  * *token* : authorization token for API calls (optional, it can increase API rate limit).

## Run the server

After configuration, you have to build the code and launch the server.

```shell
$ gulp serve:dist
```

It will automatically open the dashboard in your browser.

## Use

Use directly the page path in order to select a team.

```
http://gtr-url/index.html#/myTeam
```

Colors show the PR statuses :
* *black* when there is no test
* *yellow* when the tests are running
* *red* when tests fail
* *green* when tests are successful

## Installation for dev

#### Clone and init the project

```shell
$ git clone https://github.com/M6Web/GithubTeamReviewer.git
```

Install [Vagrant](http://www.vagrantup.com/downloads) and configure `Vagrantfile` :

```shell
$ cp Vagrantfile.dist Vagrantfile
```

*Note : configure your own Vagrantfile and provisionning if necessary.*

```shell
$ vagrant up
$ vagrant ssh
$ vagrant provision # because of npm issue on the first vagrant up 
$ cd /vagrant
```

#### Install dependencies

```shell
$ sudo npm install --no-bin-links
$ bower install
```

[Configure your application](#configuration) via `config/config.json`.

#### Run the server

```shell
$ gulp serve
```

You can now access the application at `http://localhost:9000`.

## Tests

Test the unbuilt code :

```shell
$ gulp test
```

Test the build :

```shell
$ gulp test:dist
```

## Credits

Developed by the [Cytron Team](http://cytron.fr/) of [M6 Web](http://tech.m6web.fr/).

## License

[Github Team Reviewer](https://github.com/M6Web/GithubTeamReviewer) is licensed under the [MIT license](LICENSE).
