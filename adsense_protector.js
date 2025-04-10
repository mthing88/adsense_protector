let clickCount = 0;

function isAdsenseAd(element) {
    if (!element) return false;

    // Check if it's an iframe ad
    if (element.tagName === 'IFRAME' && element.src && element.src.includes('google')) {
        return true;
    }

    // Check if it's an ins ad with google publisher id
    if (element.tagName === 'INS' && element.getAttribute('data-ad-client') && element.getAttribute('data-ad-client').includes('pub-')) {
        return true;
    }

    return false;
}

function addClickCount() {
    let currentCount = localStorage.getItem('adsenseClickCount') ? parseInt(localStorage.getItem('adsenseClickCount')) : 0;

    if (currentCount <= 2) {
        currentCount++;
        localStorage.setItem('adsenseClickCount', currentCount.toString());
    }

    if (currentCount > 2) {
        const warningMessage = '애드센스 연속 클릭 3회 진행하셨기에 무효트래픽 공격으로 간주하여 IP 추적 진행합니다. 악의적인 광고 클릭 멈추시겠습니까?';

        const confirmResult = confirm(warningMessage);

        if (!confirmResult) {
            // Redirect to blog root domain (e.g., https://ttoyum.com)
            window.location.replace(location.origin);
        }

        // Reset count after showing message
        localStorage.setItem('adsenseClickCount', '0');
    }
}

window.addEventListener('blur', function () {
    const activeElement = document.activeElement;

    if (isAdsenseAd(activeElement)) {
        if (window.location.href.includes('#google_vignette')) return;

        addClickCount();

        setTimeout(function () {
            activeElement.blur();
        }, 1);
    }
});
