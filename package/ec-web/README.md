This is a starter template for [Learn Next.js](https://nextjs.org/learn).

# Install storybook

https://storybook.js.org/docs/react/get-started/install

```bash
# Add Storybook:
npx sb init

npm run storybook
```

## Enable sass support

https://github.com/storybookjs/presets/tree/master/packages/preset-scss#basic-usage

Basic usage

```bash
npm i -D @storybook/preset-scss css-loader sass sass-loader style-loader
```
Then add the following to .storybook/main.js:

```js
module.exports = {
  addons: ['@storybook/preset-scss'],
};
```
