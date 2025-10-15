export const timestampFormat = (timestamp) => {
  let curTimestamp = parseInt(new Date().getTime() / 1000), //当前时间戳
    timestampDiff = curTimestamp - timestamp, // 参数时间戳与当前时间戳相差秒数
    curDate = new Date(curTimestamp * 1000), // 当前时间日期对象
    tmDate = new Date(timestamp * 1000), // 参数时间戳转换成的日期对象
    Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1, d = tmDate.getDate(),
    H = tmDate.getHours(), i = tmDate.getMinutes(),
    s = tmDate.getSeconds();
  if (timestampDiff < 60) { // 一分钟以内
    return '刚刚';
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + '分钟前';
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
    } else if (curDate.getFullYear() == Y) {
      return ((String(m).length == 1 ? '0' : '') + m) + '月' + ((String(d).length == 1 ? '0' : '') + d) + '日 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
    } else {
      return Y + '年' + ((String(m).length == 1 ? '0' : '') + m) + '月' + ((String(d).length == 1 ? '0' : '') + d) + '日 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
    }
  }
}
