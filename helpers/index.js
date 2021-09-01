import jwtDecode from 'jwt-decode';
const cookieparser = require('cookieparser');

export function getUserFromCookie(req) {
  console.log('ここはhelper/getUserFromCookie()');
  // cookieが無い場合
  if (!req.headers.cookie) {
    return console.log('cookieがないので何もしない');
  }
  // cookieがある場合トークンを作成
  if (req.headers.cookie) {
    const parsed = cookieparser.parse(req.headers.cookie);
    const accessTokenCookie = parsed.access_token;
    if (!accessTokenCookie) return;
    console.log('cookieがあるのでJWTをデコード(別の形式に変換されたデータを戻す)。');
    console.log('アクセストークンクッキー' + accessTokenCookie);
    const decodedToken = jwtDecode(accessTokenCookie); // ③
    console.log('デコードしたトークン' + JSON.stringify(decodedToken));
    console.log(decodedToken.email);
    if (!decodedToken) return;
    console.log('これからデコードしたjwtを返します');
    return decodedToken;
  }
}
