module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/solent',
          permanent: true,
        },
      ]
    },
  }
  