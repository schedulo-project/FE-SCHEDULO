import { useEffect, useState } from "react";

const HtmlWidget = (props) => {
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    // props.payload에서 데이터 직접 가져오기
    if (props.payload?.htmlContent) {
      setHtmlContent(props.payload.htmlContent.html);
    }
  }, []);

  if (!htmlContent) return null;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default HtmlWidget;
