function collectAnnouncedProviders(target, timeoutMs = 250) {
  return new Promise((resolve) => {
    const found = [];
    const onAnnounce = (event) => {
      if (event && event.detail) found.push(event.detail);
    };
    target.addEventListener('eip6963:announceProvider', onAnnounce);
    target.dispatchEvent(new Event('eip6963:requestProvider'));
    setTimeout(() => {
      target.removeEventListener('eip6963:announceProvider', onAnnounce);
      resolve(found);
    }, timeoutMs);
  });
}

module.exports = { collectAnnouncedProviders };
