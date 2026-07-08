const ROM_QUERY_KEYS = ['rom', 'romUrl'];
const ROM_NAME_QUERY_KEYS = ['romName', 'romFileName'];
const DEFAULT_ROM_FILE_NAME = 'Remote ROM';

const getFirstQueryValue = (params, keys) => {
  for (let i = 0; i < keys.length; i++) {
    const value = params.get(keys[i]);

    if (value) {
      return value;
    }
  }

  return undefined;
};

const getFileNameFromUrl = (romUrl, baseUrl) => {
  try {
    const parsedUrl = baseUrl ? new URL(romUrl, baseUrl) : new URL(romUrl);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    const fileName = pathParts[pathParts.length - 1];

    return fileName ? decodeURIComponent(fileName) : DEFAULT_ROM_FILE_NAME;
  } catch (error) {
    const pathWithoutHash = romUrl.split('#')[0];
    const pathWithoutQuery = pathWithoutHash.split('?')[0];
    const pathParts = pathWithoutQuery.split('/').filter(Boolean);
    const fileName = pathParts[pathParts.length - 1];

    return fileName ? decodeURIComponent(fileName) : DEFAULT_ROM_FILE_NAME;
  }
};

const getAutoLoadROMConfig = (queryString, baseUrl) => {
  if (!queryString) {
    return false;
  }

  const params = new URLSearchParams(queryString);
  const url = getFirstQueryValue(params, ROM_QUERY_KEYS);

  if (!url) {
    return false;
  }

  return {
    fileName: getFirstQueryValue(params, ROM_NAME_QUERY_KEYS) || getFileNameFromUrl(url, baseUrl),
    url
  };
};

const autoLoadROMFromQueryString = (queryString, loadROM, baseUrl) => {
  const config = getAutoLoadROMConfig(queryString, baseUrl);

  if (!config) {
    return false;
  }

  return loadROM(config.url, config.fileName, {
    forcePlay: true
  });
};

module.exports = {
  autoLoadROMFromQueryString,
  getAutoLoadROMConfig
};
