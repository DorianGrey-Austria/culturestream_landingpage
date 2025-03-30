/**
 * Babel-Konfiguration für Jest-Tests in CultureStream
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env', 
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
}; 