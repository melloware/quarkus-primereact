<div align="center">
<img src="https://github.com/melloware/quarkus-primereact/blob/main/src/main/webui/public/static/images/quarkus.svg" width="67" height="70" ><img src="https://github.com/melloware/quarkus-primereact/blob/main/src/main/webui/public/static/images/plus-sign.svg" height="70" ><img src="https://github.com/melloware/quarkus-primereact/blob/main/src/main/webui/public/static/images/primereact-dark.svg" height="70" >

# Quarkus PrimeReact
</div>
<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Actions CI](https://img.shields.io/github/actions/workflow/status/melloware/quarkus-primereact/build.yml?branch=main&logo=GitHub&style=for-the-badge)](https://github.com/melloware/quarkus-primereact/actions/workflows/build.yml)
[![Quarkus](https://img.shields.io/badge/quarkus-power-blue?logo=quarkus&style=for-the-badge)](https://github.com/quarkusio/quarkus)
![React.js](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Typescript](https://img.shields.io/badge/typescript-%23323330.svg?style=for-the-badge&logo=typescript&logoColor=%23F7DF1E) 

**If you like this project, please consider supporting me ❤️**

[![GitHub Sponsor](https://img.shields.io/badge/GitHub-FFDD00?style=for-the-badge&logo=github&logoColor=black)](https://github.com/sponsors/melloware)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.me/mellowareinc)

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) is a minimal CRUD service exposing a couple of endpoints over REST,
with a front-end based on React so you can play with it from your browser.

While the code is surprisingly simple, under the hood this is using:

- [Quarkus REST](https://quarkus.io/guides/rest) for REST API endpoints with OpenAPI documentation
- [Quarkus WebSockets Next](https://quarkus.io/guides/websockets-next-tutorial) for real-time WebSocket communication
- [Quarkus RESTEasy Problem](https://github.com/quarkiverse/quarkus-resteasy-problem) for consistent REST API error handling
- [Quarkus Quinoa](https://github.com/quarkiverse/quarkus-quinoa) to handle allowing this monorepo to serve React and Java code
- [Hibernate ORM with Panache](https://quarkus.io/guides/hibernate-orm-panache) to perform the CRUD operations on the database
- [PostgreSQL](https://www.postgresql.org/) database; automatically starts an embedded DB
- [Liquibase](https://www.liquibase.com/) to automatically update database
- [React + PrimeReact](https://primereact.org/) for a top notch user interface including lazy datatable
- [React Hook Forms](https://react-hook-form.com/) to validate user input data
- [React Websocket](https://github.com/robtaussig/react-use-websocket) to handle websocket connections
- [TanStack Query](https://tanstack.com/query/latest) for powerful asynchronous state management for TypeScript
- [Orval](https://orval.dev/) to generate TanStack Query client Typescript from the OpenAPI definition

## Requirements

To compile and run this demo you will need:

- JDK 17+
- Apache Maven

## Code Generation

This project uses [Orval](https://orval.dev/) to generate the [TanStack Query](https://tanstack.com/query/latest) client Typescript from the OpenAPI definition.

[![Code Generation](https://github.com/melloware/quarkus-primereact/blob/main/src/test/resources/dev-flow.png)](https://github.com/melloware/quarkus-primereact)


## Developing

### Live coding with Quarkus

The Maven Quarkus plugin provides a development mode that supports
live coding. To try this out:

```bash
$ ./mvnw quarkus:dev
```

Watch as it starts up a temporary PostreSQL database just for this session. In this mode you can make changes to the code and have the changes immediately applied, by just refreshing your browser.

> :bulb:
Hot reload works add a new REST endpoint and see it update in realtime. Try it!

Now open your web browser to http://localhost:8080/ to see it in action.

[![Quarkus Monorepo](https://github.com/melloware/quarkus-primereact/blob/main/src/test/resources/quarkus-primereact-screen.png)](https://github.com/melloware/quarkus-primereact)

## Building

### Run Quarkus PrimeReact in JVM mode

When you're done iterating in developer mode, you can run the application as a
conventional jar file.

First compile it:

```bash
$ ./mvnw clean package
```

Then run it with:

```bash
$ java -jar ./target/quarkus-app/quarkus-run.jar
```

Or build it as a single executable JAR file (known as an uber-jar):

```bash
$ ./mvnw clean package -Dquarkus.package.type=uber-jar
```

Then run it with:

```bash
$ java -jar ./target/quarkus-primereact-{version}-runner.jar
```

Navigate to:
<http://localhost:8080/>


### Run Quarkus PrimeReact in Docker

You can easily build a Docker image of this application with the following command:

```bash
$ ./mvnw -Pdocker
```

You will be able to run this binary directly where ${version} is the current project version:

```bash
$ docker run -i --rm -p 8000:8000 melloware/quarkus-primereact:latest
```

> :bulb:
Now observe the time it took to boot, and remember: that time was mostly spent to generate the tables in your database and import the initial data.

## See it in your browser

Navigate to: <http://localhost:8080/index.html>

