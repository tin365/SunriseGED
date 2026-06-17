import { useEffect } from 'react';

const pageId = 'YOUR_FACEBOOK_PAGE_ID';

export default function MessengerChat() {
  useEffect(() => {
    (window as unknown as { fbAsyncInit?: () => void }).fbAsyncInit = function () {
      const fb = (window as unknown as { FB?: { init: (opts: Record<string, unknown>) => void } }).FB;
      if (fb) fb.init({ xfbml: true, version: 'v18.0' });
    };
    const id = 'facebook-jssdk';
    if (document.getElementById(id)) return;
    const js = document.createElement('script');
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
    const fjs = document.getElementsByTagName('script')[0];
    fjs?.parentNode?.insertBefore(js, fjs);
  }, []);

  return (
    <>
      <div id="fb-root" />
      <div
        dangerouslySetInnerHTML={{
          __html: `<div class="fb-customerchat" attribution="biz_inbox" page_id="${pageId}" theme_color="#D6562A" logged_in_greeting="Hello! How can Sunrise GED help you today?" logged_out_greeting="Hello! Ask us about enrollment or our programs."></div>`
        }}
      />
    </>
  );
}
