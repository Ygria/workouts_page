import { useEffect, useState } from 'react';

const useIsEmbedded = () => {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // 检测当前页面是否被嵌入到 iframe 中
    if (window.self !== window.top) {
      setIsEmbedded(true);
    }
  }, []);

  return isEmbedded;
};

export default useIsEmbedded;
