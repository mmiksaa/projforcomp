import './scss/App.scss';

import { useEffect, useState } from 'react';
import axios from 'axios';

import Filters from './components/Filters';
import useDebounce from './hooks/useDebounce';
import LoaderSvg from './assets/loader.svg';

//статичные данные
const columnsData = ['#', 'Дата (мес)', 'Название', 'Количество', 'Расстояние'];

interface IData {
  //интерфейс для бд
  date: number;
  name: number;
  count: number;
  distance: string;
  id: number;
}

const App = () => {
  const [data, setData] = useState<Array<IData>>([]); //хранилище данных с бд
  const [filteredData, setFilteredData] = useState<Array<IData>>([]); // отсартированое хранилище данных
  const [filterColumn, setFilterColumn] = useState<Array<string>>(['name', 'Название']); //активный филтр
  const [filterСondition, setFilterСondition] = useState<string>('равно'); //активный филтр
  const [searchValue, setSearchValue] = useState<string>(''); //управляемый компонент(поиск по фильтру)
  const debouncedValue = useDebounce(searchValue, 250); //хок функция дебаунс

  useEffect(() => {
    //запрос на мокапи
    axios.get('https://62e25efce8ad6b66d8596524.mockapi.io/building').then(({ data }) => {
      setData(data); // сохраняем в стейты
      setFilteredData(data);
    });
  }, []);

  useEffect(() => {
    //эту логику можно перенести в отдельный код. Но я решил оставить тут
    if (searchValue) {
      switch (filterСondition) {
        case 'равно': {
          const newData = data.filter((item) => item[filterColumn[0] as keyof IData] === searchValue);
          setFilteredData(newData);
          break;
        }

        case 'содержить': {
          const newData = data.filter((item) =>
            String(item[filterColumn[0] as keyof IData]).includes(searchValue),
          );
          setFilteredData(newData);
          break;
        }

        case 'больше': {
          if (typeof data[0][filterColumn[0] as keyof IData] == 'number') {
            const newData = data.filter((item) => {
              return item[filterColumn[0] as keyof IData] >= searchValue;
            });
            setFilteredData(newData);
          }
          break;
        }

        case 'меньше': {
          if (typeof data[0][filterColumn[0] as keyof IData] == 'number') {
            const newData = data.filter((item) => {
              return item[filterColumn[0] as keyof IData] <= searchValue;
            });
            setFilteredData(newData);
          }
          break;
        }
      }
    } else {
      setFilteredData(data);
    }

    // eslint-disable-next-line
  }, [debouncedValue]);

  const list = filteredData.map(({ date, name, count, distance, id }, index) => {
    return (
      <ul className='list' key={id}>
        <li>{index + 1}</li>
        <li>{date}</li>
        <li>{name}</li>
        <li>{count}</li>
        <li>{distance}</li>
      </ul>
    );
  });

  return data.length ? (
    <div className='container'>
      <Filters
        filterColumn={filterColumn}
        setFilterColumn={setFilterColumn}
        filterСondition={filterСondition}
        setFilterСondition={setFilterСondition}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />

      <ul className='table'>
        <li>
          <ul className='list list--top'>
            {columnsData.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          {filteredData.length ? <li>{list}</li> : <p className="notfound">ничего не найдено</p>} 
        </li>
      </ul>
    </div>
  ) : (
    <div className='container'>
      <img className="loader-svg" src={LoaderSvg} alt='loader' />
    </div>
  );
};

export default App;
