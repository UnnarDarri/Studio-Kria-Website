# Studio Kría website

This website is built using [Eleventy](https://www.11ty.dev).

## Structure

The site is a multilanguage site. String translations (implemented via i18next) are located in the [`/locales/`](/locales/) directory. Page layouts are language-independent and located in [`/_includes/pages/`](/_includes/pages/). On build/development, corresponding layout files are automatically generated and placed in the [`/is/`](/is/) and [`/en/`](/en/) directories. They are only created if they don't exist, so in order to regenerate them they have to be deleted. The default language is `is` and its `index.html` is copied to the site root after it is built.

The site navigation (main menu + footer menu) is created dynamically using the data in [`/_data/navigation.js`](/_data/navigation.js).

## Prerequisites

Set up the dependencies via:

```sh
npm install
```

## Running

Run the development server via:

```sh
npm start
```

If using VS Code, a debugger configuration with the built-in browser is included.

## Building

Build the site for production via:

```sh
npm run build
```
