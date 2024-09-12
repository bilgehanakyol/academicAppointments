import { useParams } from 'react-router-dom';

export default function AcademianCalendar() {
  const { academianId } = useParams();
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await axios.get(`/academicians/${academianId}/calendar`);
        setCalendar(response.data);
      } catch (err) {
        setError('Takvim yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [academianId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Takvim</h1>
      {calendar ? (
        <ul>
          {calendar.availability.map((day, index) => (
            <li key={index}>
              <strong>{day.day}</strong>
              <ul>
                {day.slots.map((slot, idx) => (
                  <li key={idx}>
                    {slot.startTime} - {slot.endTime}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Takvim bulunamadı.</p>
      )}
    </div>
  );
}
