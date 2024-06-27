import InFiniteList from '@/libs/infiniteList';
import Waterfall from '@/libs/waterfall'; // render props版本,预加载逐个加载
// import withWaterfall from '@/libs/waterfall/indexHOC.tsx';
import { getPicture } from '@/service/collcation';
import { useState } from 'react';
export interface CardProps {
  data: any;
  width?: number;
}
const Card: React.FC<CardProps> = ({ data, width }) => {
  return (
    <>
      <div style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden' }}>
        <img
          src={data.photo}
          width={width ? width : '100%'}
          height={width ? (width / data.photoWidth) * data.photoHeight : 'auto'}
        ></img>
      </div>
    </>
  );
};

// const Waterfall = withWaterfall(Card);

const Collection = () => {
  const [data, setData] = useState<any[]>([]);
  const [size] = useState(20);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const fetch = async () => {
    setIsLoading(true);
    const params = { size, page };
    const [pictures, err] = await getPicture(params);
    if (err) {
      return;
    }
    const currentData = [...data, ...pictures.list];
    setData(currentData);
    setPage(page + 1);
    setIsLoading(false);
    if (currentData.length === pictures.total) {
      setIsFinished(true);
    }
  };

  return (
    <>
      <InFiniteList
        isFinished={isFinished}
        isLoading={isLoading}
        load={fetch}
      >
        <Waterfall
          data={data}
          col={5}
          nodeKey={'_id'}
          isPreReading={true}
          renderChild={(item: any, colWidth?: number) => (
            <Card
              width={colWidth}
              data={item}
            ></Card>
          )}
        ></Waterfall>
      </InFiniteList>
    </>
  );
};

export default Collection;
