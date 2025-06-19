# CRUD Dashboard Prompts

This document captures all the prompts used during the development of the Angular CRUD dashboard application.

## Initial Setup

```
Hi crud dashboard backend is ready
```

This prompted the creation of a new frontend application for the CRUD dashboard.

```
want to create angular application for crud dashboard
```

This prompted the creation of a new Angular application specifically for the CRUD operations.

## Component Development

These prompts were used to continue the iterative development of the application:

```
@agent Continue: "Continue to iterate?"
```

Used multiple times to continue building out components and functionality.

## Error Handling

```
only white screen is shown on running could see the ui
```

This prompt was used to troubleshoot the white screen issue, which was resolved by:
- Adding `standalone: true` to all component decorators
- Cleaning up the app.html file by removing duplicate code and router outlets
- Adding missing styles

```
getting error in concole  Could not resolve "@angular/animations/browser" imported by "@angular/platform-browser". Is it installed?
    at optional-peer-dep:__vite-optional-peer-dep:@angular/animations/browser:@angular/platform-browser (platform-browser:1:7)
```

This prompted the installation of the @angular/animations package to resolve Angular Material animation dependencies.

## Documentation

```
capture all promts used in a promts.md file
```

This prompt requested the creation of this documentation file to track all prompts used in the development process.
