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

- [Quarkus REST and WebSockets Next](https://quarkus.io/guides/rest-web-sockets-next) to expose the REST endpoints and documented with OpenAPI and websocket data
- [Hibernate ORM with Panache](https://quarkus.io/guides/hibernate-orm-panache) to perform the CRUD operations on the database
- [PostgreSQL](https://www.postgresql.org/) database; automatically starts an embedded DB
- [Liquibase](https://www.liquibase.com/) to automatically update database
- [Quinoa](https://github.com/quarkiverse/quarkus-quinoa) to handle allowing this monorepo to serve React and Java code
- [React + PrimeReact](https://primereact.org/) for a top notch user interface including lazy datatable
- [TanStack Query](https://tanstack.com/query/latest) for powerful asynchronous state management for TypeScript
- [Orval](https://orval.dev/) to generate TanStack Query client Typescript from OpenAPI definition
- [React Hook Forms](https://react-hook-form.com/) to validate user input data
- [React Websocket](https://github.com/robtaussig/react-use-websocket) to handle websocket connections

## Requirements

To compile and run this demo you will need:

- JDK 17+

## Code Generation

This project uses [Orval](https://orval.dev/) to generate the TanStack Query client Typescript from the OpenAPI definition.

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

### Run Quarkus in JVM mode

When you're done iterating in developer mode, you can run the application as a
conventional jar file.

First compile it:

```bash
$ ./mvnw package
```

Connection properties for the Agroal datasource are defined in the standard Quarkus configuration file,
`src/main/resources/application.properties`.

Then run it with:

```bash
$ java -jar ./target/quarkus-app/quarkus-run.jar
```
Navigate to:
<http://localhost:8080/>

> :bulb:
Have a look at how fast it boots. Or measure total native memory consumption...

### Run Quarkus as a native application

You can also create a native executable from this application without making any
source code changes. A native executable removes the dependency on the JVM:
everything needed to run the application on the target platform is included in
the executable, allowing the application to run with minimal resource overhead.

Compiling a native executable takes a bit longer, as GraalVM performs additional
steps to remove unnecessary codepaths. Use the  `native` profile to compile a
native executable:

```bash
$ mvn -Pnative
```

After getting a cup of coffee, you'll be able to run this binary directly where ${version} is the current project version:

```bash
$ docker run -i --rm -p 8080:8080 melloware/quarkus-primereact:${version}
```

> :bulb:
Please brace yourself: don't choke on that fresh cup of coffee you just got. Now observe the time it took to boot, and remember: that time was mostly spent to generate the tables in your database and import the initial data.

## See it in your browser

Navigate to: <http://localhost:8080/index.html>

