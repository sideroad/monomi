
export default function humanize(min) {
  const hour = Math.floor(min / 60);
  const minutes = min % 60;
  return `${hour >= 2 ? `${hour} hrs` : hour === 1 ? `${hour} hr` : ''} ${minutes !== 0 ? `${minutes} min` : ''}`;
}
