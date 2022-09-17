[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Actions CI](https://github.com/primefaces/primefaces/workflows/CI/badge.svg)](https://github.com/melloware/quarkus-monorepo/actions/workflows/build.yml)
# Quarkus Monorepo

<img src="https://github.com/melloware/quarkus-monorepo/blob/main/src/main/webapp/public/static/images/quarkus.svg" height="50" ><img src="https://github.com/melloware/quarkus-monorepo/blob/main/src/main/webapp/public/static/images/plus-sign.svg" height="50" ><img src="https://github.com/melloware/quarkus-monorepo/blob/main/src/main/webapp/public/static/images/primereact-dark.svg" height="50" >

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) is a minimal CRUD service exposing a couple of endpoints over REST,
with a front-end based on React so you can play with it from your browser.

While the code is surprisingly simple, under the hood this is using:

- RESTEasy to expose the REST endpoints and documented with OpenAPI
- Hibernate ORM with Panache to perform the CRUD operations on the database
- PostgreSQL database; see below to run one via Docker
- Liquibase to automatically update database
- React + PrimeReact for a top notch user interface including lazy datatable
- TanStack Query for powerful asynchronous state management for TypeScript
- Orval to generate TanStack Query client Typescript from OpenAPI definition
- React Hook Forms to validate user input data

## Requirements

To compile and run this demo you will need:

- JDK 11+
- Docker

In addition, you will need either a PostgreSQL database, or Docker to run one.

## Developing

### Live coding with Quarkus

The Maven Quarkus plugin provides a development mode that supports
live coding. To try this out:

```bash
$ ./mvnw compile quarkus:dev
```

Watch as it starts up a temporary PostreSQL database just for this session. In this mode you can make changes to the code and have the changes immediately applied, by just refreshing your browser.

> :bulb:
Hot reload works add a new REST endpoint and see it update in realtime. Try it!

To modify the React UI and perform live coding try this out:

```bash
$ npm install
$ npm run start
```

Now open your web browser to http://localhost:3000/ to see it in action.

[![Quarkus Monorepo](https://github.com/melloware/quarkus-monorepo/blob/main/src/test/resources/quarkus-monorepo-screen.png)](https://github.com/melloware/quarkus-monorepo)

## Building

### Run Quarkus in JVM mode

When you're done iterating in developer mode, you can run the application as a
conventional jar file.

First compile it:

```bash
$ npm install
$ npm run build
$ ./mvnw package
```

Next we need to make sure you have a PostgreSQL instance running (Quarkus automatically starts one for dev and test mode). To set up a PostgreSQL database with Docker:

```bash
$ docker run -it --rm=true --name quarkus_postgres -e POSTGRES_USER=quarkus_postgres -e POSTGRES_PASSWORD=quarkus_postgres -e POSTGRES_DB=quarkus_postgres -p 5432:5432 postgres:14
```

Connection properties for the Agroal datasource are defined in the standard Quarkus configuration file,
`src/main/resources/application.properties`.

Then run it with:

```bash
$ java -jar ./target/quarkus-app/quarkus-run.jar -Dquarkus.datasource.jdbc.url=jdbc:postgresql://localhost/quarkus_postgres
```
Navigate to:
<http://localhost:3000/>

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
$ mvn clean package -Dnative
```

After getting a cup of coffee, you'll be able to run this binary directly where ${version} is the current project version:

```bash
$ docker run -i --rm -p 8080:8080 melloware/quarkus-monorepo:${version}
```

> :bulb:
Please brace yourself: don't choke on that fresh cup of coffee you just got. Now observe the time it took to boot, and remember: that time was mostly spent to generate the tables in your database and import the initial data.

## See it in your browser

Navigate to: <http://localhost:8080/index.html>

## Running in Kubernetes

This section provides extra information for running both the database and the demo on Kubernetes.
As well as running the DB on Kubernetes, a service needs to be exposed for the demo to connect to the DB.

Then, rebuild demo docker image with a system property that points to the DB.

```bash
-Dquarkus.datasource.jdbc.url=jdbc:postgresql://<DB_SERVICE_NAME>/quarkus_postgres
```
