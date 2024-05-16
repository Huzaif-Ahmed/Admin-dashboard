import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


interface PermaCode {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  user_address: string;
  referral_code: string;
}

interface Referral {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  referral_code: string;
  referrer_address: string;
  user_address: string;
}

interface Data {
  perma_codes: PermaCode[];
  referrals: Referral[];
}

function App() {
  console.log(JSON.stringify(process.env));
  const [data, setData] = useState<{ [key: string]: { referral_code: string; referred_to: string[] } } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Basic ${token}`
      };
      try {
        const response = await axios.get<Data>(import.meta.env.VITE_API_REFERRAL, { headers });
        const d = response.data;
        let dataObj: { [key: string]: { referral_code: string; referred_to: string[] } } = {};
        d.perma_codes.forEach((item: PermaCode) => {
          if (!dataObj[item.user_address]) {
            dataObj[item.user_address] = {
              referral_code: item.referral_code,
              referred_to: []
            };
          }
        });

        d.referrals.forEach((item: Referral) => {
          if (dataObj[item.referrer_address]) {
            dataObj[item.referrer_address].referred_to.push(item.user_address);
          }
        });

        setData(dataObj);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const ToggleModal = () => {
    setShowModal(!showModal);
  }

  return (
    <div className="admin-board p-8 bg-gradient-to-r min-h-screen w-screen bg-violet-400">
      {showModal && <Modal onClose={ToggleModal} setData={setData} data={data} />}
      <div className='w-[90%] flex justify-end p-2 mx-auto '>
        <button className="self-end bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl" onClick={() => { setShowModal(true) }}>
          Create Perma Code
        </button>
      </div>
      <h1 className='w-full text-white font-semibold text-4xl mb-5'>Admin DashBoard</h1>
      <div className="main container mx-auto mt-2">
        {data && Object.entries(data).map(([key, value]) => (
          value.referral_code=="GARDEN"?null:
          <div key={key} className="mb-8 bg-white shadow-xl rounded-lg overflow-hidden ">
            <table className="w-full text-left border-collapse table-fixed">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="border px-6 py-4 w-1/3 break-words">{key}</td>
                  <td className="border px-6 py-4 w-1/3 break-words">{value.referral_code}</td>
                  <td className="border px-6 py-4 w-1/3 break-words">
                    {value.referred_to.length > 0 ? (
                      <ul>
                        {value.referred_to.map((referral, index) => (
                          <li key={index} className="py-1 px-2 bg-blue-100 rounded-md mb-2 last:mb-0 break-all">
                            {referral}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No referrals</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        {data && Object.entries(data).map(([key, value]) => (
          value.referral_code!="GARDEN"?null:
          <div key={key} className="mb-8 bg-white shadow-xl rounded-lg overflow-hidden ">
            <table className="w-full text-left border-collapse table-fixed">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="border px-6 py-4 w-1/3 break-words">{key}</td>
                  <td className="border px-6 py-4 w-1/3 break-words">{value.referral_code}</td>
                  <td className="border px-6 py-4 w-1/3 break-words">
                    {value.referred_to.length > 0 ? (
                      <ul>
                        {value.referred_to.map((referral, index) => (
                          <li key={index} className="py-1 px-2 bg-blue-100 rounded-md mb-2 last:mb-0 break-all">
                            {referral}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No referrals</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}



interface Todo {
  user_address: string;
  code: string;
}
interface ModalProps {
  onClose: () => void;
  setData: (data: { [key: string]: { referral_code: string; referred_to: string[] } }) => void;
  data: { [key: string]: { referral_code: string; referred_to: string[] } } | null;
}

const Modal: React.FC<ModalProps> = ({ onClose, setData, data }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoUserAddress, setNewTodoUserAddress] = useState<string>('');
  const [newTodoCode, setNewTodoCode] = useState<string>('');

  const handleAddClick = () => {
    const newTodo: Todo = { user_address: newTodoUserAddress, code: newTodoCode };
    setTodos([...todos, newTodo]);
    setNewTodoUserAddress('');
    setNewTodoCode('');
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(import.meta.env.VITE_API_PERMACODE_CREATE, { codes: todos }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        }
      });
      console.log(response.data);
      // Assuming response.data contains the updated data structure
      // First, create a copy of the current data
      const newData = { ...data };
      todos.forEach((todo) => {
        // Check if the user address already exists in the data
        if (!newData[todo.user_address]) {
          // If not, add a new entry for this user address
          newData[todo.user_address] = {
            referral_code: todo.code,
            referred_to: [] as string[] // Initialize referred_to as an empty string array
          };
        }
      });
      // Now, update the state with the new data
      setData(newData);
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">

        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Create Perma Code</p>
            <div className="modal-close cursor-pointer z-50" onClick={onClose}>
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M18 1.5l-1.5-1.5-6 6-6-6-1.5 1.5 6 6-6 6 1.5 1.5 6-6 6 6 1.5-1.5-6-6z"
                ></path>
              </svg>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {todos.map((todo, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  placeholder={`User Address ${index + 1}`}
                  value={todo.user_address}
                  readOnly
                />
                <input
                  type="text"
                  placeholder={`Code ${index + 1}`}
                  value={todo.code}
                  readOnly
                />
              </div>
            ))}
            <div className="   flex flex-col gap-3">
              <input
                type="text"
                placeholder="User Address"
                value={newTodoUserAddress}
                onChange={(e) => setNewTodoUserAddress(e.target.value)}
                className="w-full  pl-2 p-1 rounded-2xl bg-slate-200"
              />
              <input
                type="text"
                placeholder="Code"
                value={newTodoCode}
                onChange={(e) => setNewTodoCode(e.target.value)}
                className="w-full pl-2 p-1 rounded-2xl bg-gray-200" 
              />
              
            </div>
            <button
              type="button"
              onClick={handleAddClick}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
