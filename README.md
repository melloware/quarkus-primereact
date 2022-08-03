[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Actions CI](https://github.com/primefaces/primefaces/workflows/CI/badge.svg)](https://github.com/melloware/quarkus-monorepo/actions/workflows/build.yml)

# Quarkus Monorepo

This [monorepo](https://en.wikipedia.org/wiki/Monorepo) is a minimal CRUD service exposing a couple of endpoints over REST,
with a front-end based on React so you can play with it from your browser.

While the code is surprisingly simple, under the hood this is using:

- RESTEasy to expose the REST endpoints
- Hibernate ORM with Panache to perform the CRUD operations on the database
- PostgreSQL database; see below to run one via Docker
- ArC, the CDI inspired dependency injection tool with zero overhead
- Agroal, The high performance connection pool
- Infinispan based caching
- Narayana Transaction Manager, For safely coordinated transactions

## Requirements

To compile and run this demo you will need:

- JDK 11+
- Docker

In addition, you will need either a PostgreSQL database, or Docker to run one.

## Developing
-------------------------

### Live coding with Quarkus

The Maven Quarkus plugin provides a development mode that supports
live coding. To try this out:

```bash
$ ./mvnw compile quarkus:dev
```

In this mode you can make changes to the code and have the changes immediately applied, by just refreshing your browser.

    Hot reload works even when modifying your JPA entities.
    Try it! Even the database schema will be updated on the fly.

To modify the React UI and perform live coding try this out:

```bash
$ npm install
$ npm run start
```

Now open your web browser to http://localhost:3000/ to see it in action.

## Building
-------------------------

### Run Quarkus in JVM mode

When you're done iterating in developer mode, you can run the application as a
conventional jar file.

First compile it:

```bash
$ npm install
$ npm run build
$ ./mvnw package
```

Next we need to make sure you have a PostgreSQL instance running (Quarkus automatically starts one for dev and test mode). To set up a PostgreSQL database with
Docker:

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


    Have a look at how fast it boots.
    Or measure total native memory consumption...

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

After getting a cup of coffee, you'll be able to run this binary directly:

```bash
$ docker build -f src/main/docker/Dockerfile.native -t melloware/quarkus-monorepo .
$ docker run -i --rm -p 8080:8080 melloware/quarkus-monorepo
```

    Please brace yourself: don't choke on that fresh cup of coffee you just got.
    
    Now observe the time it took to boot, and remember: that time was mostly spent to generate the tables in your database and import the initial data.
    
    Next, maybe you're ready to measure how much memory this service is consuming.

N.B. This implies all dependencies have been compiled to native;
that's a whole lot of stuff: from the bytecode enhancements that Panache
applies to your entities, to the lower level essential components such as the PostgreSQL JDBC driver, the Undertow webserver.

## See it in your browser

Navigate to:

<http://localhost:8080/index.html>

Have fun, and join the team of contributors!

## Running in Kubernetes

This section provides extra information for running both the database and the demo on Kubernetes.
As well as running the DB on Kubernetes, a service needs to be exposed for the demo to connect to the DB.

Then, rebuild demo docker image with a system property that points to the DB.

```bash
-Dquarkus.datasource.jdbc.url=jdbc:postgresql://<DB_SERVICE_NAME>/quarkus_postgres
```
