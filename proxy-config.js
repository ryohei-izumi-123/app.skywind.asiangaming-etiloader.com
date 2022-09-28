module.exports = {
  '/api/': {
    'target': 'http://api.skywind.asiangaming-etiloader.com/api',
    'pathRewrite': {
      '^/api': ''
    },
    'secure': false,
    'bypass': (req, res, proxyOptions) => {
      // req.headers['x-forwarded-for'] = '192.168.33.10';
      req.headers['x-forwarded-for'] = '220.128.218.247';
    }
  }
};
