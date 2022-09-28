import React, { useEffect, useRef, useState } from 'react';

//решил не выносить это в бд, а оставить тут, так-как по мне это статичные данные
const dataColumns = [
  ['name', 'Название'],
  ['count', 'Количество'],
  ['distance', 'Расстояние'],
];

const dataConds = ['равно', 'содержить', 'больше', 'меньше'];

type FiltersProps = {
  filterColumn: string[];
  setFilterColumn: (array: string[]) => void;
  filterСondition: string;
  setFilterСondition: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
};

type DropdownClick = MouseEvent & {
  //для mouseEvent for ts
  path: Node[];
};

const Filters = ({
  filterColumn,
  setFilterColumn,
  filterСondition,
  setFilterСondition,
  searchValue,
  setSearchValue,
}: FiltersProps): JSX.Element => {
  const [colDropdown, setColDropdown] = useState(false); //dropdown с колонками
  const [condDropdown, setCondDropdown] = useState(false); //dropdown с решением
  const condRef = useRef(null); //рефы чтобы понять был клик на элемент или нет
  const colRef = useRef(null);

  useEffect(() => {
    //функция проверяет: если был клик не в dropdown, то сделай их не активными

    const handleClickOutside = (event: MouseEvent) => {
      const _event = event as DropdownClick;
      if (
        colRef.current &&
        !_event.path.includes(colRef.current) &&
        condRef.current &&
        !_event.path.includes(condRef.current)
      ) {
        setColDropdown(false);
        setCondDropdown(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);
  }, []);

  const onFilterCol = (item: string[]) => {
    setColDropdown(false);
    setFilterColumn(item);
  }

  const onFilterСond = (item: string) => {
    setCondDropdown(false);
    setFilterСondition(item);
  };

  //формирует фильтры
  const columns = dataColumns.map((item, index) => (
    <li onClick={() => onFilterCol(item)} className='dropdown__item' key={index}>
      {item[1]}
    </li>
  ));

  const condition = dataConds.map((item, index) => (
    <li onClick={() => onFilterСond(item)} className='dropdown__item' key={index}>
      {item}
    </li>
  ));

  const clearValue = () => {
    setSearchValue('');
  };

  return (
    <div className='filters'>
      <div className='filter-search'>
        <input //input для поиска по филтрам
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type='text'
          className='filter-search__input'
          placeholder={`${filterСondition}...`}
        />

        {searchValue && (
          <button onClick={clearValue} className='filter-search__close'>
            x
          </button>
        )}
      </div>

      <div className='filters__right'>
        <div className='dropdown' ref={condRef}>
          <button onClick={() => setCondDropdown(!condDropdown)} className='dropdown__item dropdown__active'>
            {filterСondition}
          </button>

          {condDropdown && <ul className='dropdown__list'> {condition} </ul>}
        </div>

        <div className='dropdown' ref={colRef}>
          <button onClick={() => setColDropdown(!colDropdown)} className='dropdown__item dropdown__active'>
            {filterColumn[1]}
          </button>

          {colDropdown && <ul className='dropdown__list'> {columns} </ul>}
        </div>
      </div>
    </div>
  );
};

export default Filters;
