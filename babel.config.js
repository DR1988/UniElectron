/* eslint-disable */
const developmentEnvironments = ['development'];

const developmentPlugins = [
  require('react-refresh/babel'),
  require('@babel/plugin-proposal-class-properties'),
  require('@babel/plugin-proposal-object-rest-spread')
];


const productionPlugins = [
  require('@babel/plugin-proposal-class-properties'),
  require('@babel/plugin-proposal-object-rest-spread')
]

module.exports = (api) => {

  const development = api.env(developmentEnvironments);

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: '45.0.0' },
        },
      ],
      [require('@babel/preset-typescript')],
      // modern (automatic) JSX transform — рекомендован для React 19,
      // убирает предупреждение про устаревший classic-runtime
      [require('@babel/preset-react'), { runtime: 'automatic', development }]
    ],
    plugins: [
      ...(development ? developmentPlugins : productionPlugins),
    ],
  }
}
