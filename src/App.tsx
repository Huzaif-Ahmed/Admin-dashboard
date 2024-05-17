import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

type PermaCode = {
  user_address: string;
  referral_code: string;
};

type Referral = {
  referral_code: string;
  referrer_address: string;
  user_address: string;
};

type Data = {
  perma_codes: PermaCode[];
  referrals: Referral[];
};

type Referrals = {
  //referralCode
  [key: string]: {
    user_address: string;
    referred_to: string[];
  };
};

function App() {
  const [data, setData] = useState<Referrals>({} as Referrals);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Basic ${token}`,
    };
    try {
      const response = await axios.get<Data>(
        import.meta.env.VITE_API_REFERRAL,
        { headers }
      );
      const d = response.data;

      const dataObj: Referrals = {};

      for (let i = 0; i < d.perma_codes.length; i++) {
        const item = d.perma_codes[i];
        if (item.referral_code && !dataObj[item.referral_code]) {
          dataObj[item.referral_code] = {
            user_address: item.user_address,
            referred_to: [],
          };
        }
      }

      for (let i = 0; i < d.referrals.length; i++) {
        const item = d.referrals[i];
        if (dataObj[item.referral_code]) {
          dataObj[item.referral_code].referred_to.push(item.user_address);
        }
      }

      setData(dataObj);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="admin-board p-8 bg-gradient-to-r min-h-screen w-screen bg-violet-400">
      {showModal && <Modal onClose={ToggleModal} fetchData={fetchData} />}
      <div className="w-[90%] flex justify-end p-2 mx-auto ">
        <button
          className="self-end bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Create Perma Code
        </button>
      </div>
      <h1 className="w-full text-white font-semibold text-4xl mb-5">
        Admin DashBoard
      </h1>
      <div className="main container mx-auto mt-2">
        {data &&
          Object.entries(data).map(([key, value]) => {
            return key === "GARDEN" ? null : (
              <div
                key={key}
                className="mb-8 bg-white shadow-xl rounded-lg overflow-hidden "
              >
                <table className="w-full text-left border-collapse table-fixed">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td className="border px-6 py-4 w-1/5 break-words">
                        {key}
                      </td>
                      <td className="border px-6 py-4 w-2/5 break-words">
                        {value.user_address}
                      </td>
                      <td className="border px-6 py-4 w-2/5 break-words">
                        {value.referred_to.length > 0 ? (
                          <ul>
                            {value.referred_to.map((referral, index) => (
                              <li
                                key={index}
                                className="py-1 px-2 bg-blue-100 rounded-md mb-2 last:mb-0 break-all"
                              >
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
            );
          })}
        {data &&
          Object.entries(data).map(([key, value]) =>
            key !== "GARDEN" ? null : (
              <div
                key={key}
                className="mb-8 bg-white shadow-xl rounded-lg overflow-hidden "
              >
                <table className="w-full text-left border-collapse table-fixed">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td className="border px-6 py-4 w-1/5 break-words">
                        {key}
                      </td>
                      <td className="border px-6 py-4 w-2/5 break-words">
                        {value.user_address}
                      </td>
                      <td className="border px-6 py-4 w-2/5 break-words">
                        {value.referred_to.length > 0 ? (
                          <ul>
                            {value.referred_to.map((referral, index) => (
                              <li
                                key={index}
                                className="py-1 px-2 bg-blue-100 rounded-md mb-2 last:mb-0 break-all"
                              >
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
            )
          )}
      </div>
    </div>
  );
}

type ModalProps = {
  onClose: () => void;
  fetchData: () => void;
};

const Modal: React.FC<ModalProps> = ({ onClose, fetchData }) => {
  const [permaCodes, setPermaCodes] = useState([
    {
      user_address: "",
      code: "",
    },
  ]);

  const handleAddClick = () => {
    setPermaCodes([
      ...permaCodes,
      {
        user_address: "",
        code: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (permaCodes.length === 0) {
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_PERMACODE_CREATE,
        { codes: permaCodes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Perma Code Created Successfully");
        fetchData();
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="bg-white w-[700px] mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="py-4 text-left px-6">
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
                <path d="M18 1.5l-1.5-1.5-6 6-6-6-1.5 1.5 6 6-6 6 1.5 1.5 6-6 6 6 1.5-1.5-6-6z"></path>
              </svg>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {permaCodes.map((_, index) => (
              <div key={index} className="flex space-x-2 justify-center">
                <input
                  type="text"
                  placeholder={`User Address ${index + 1}`}
                  value={permaCodes[index].user_address}
                  onChange={(e) => {
                    const newPermaCodes = [...permaCodes];
                    newPermaCodes[index].user_address = e.target.value;
                    setPermaCodes(newPermaCodes);
                  }}
                  className="w-3/4 outline-none bg-gray-300 p-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={`Code ${index + 1}`}
                  value={permaCodes[index].code}
                  onChange={(e) => {
                    const newPermaCodes = [...permaCodes];
                    newPermaCodes[index].code = e.target.value;
                    setPermaCodes(newPermaCodes);
                  }}
                  className="w-1/4 outline-none bg-gray-300 p-2 rounded-lg"
                />
                <CrossIcon
                  className="cursor-pointer"
                  onClose={() => {
                    const newPermaCodes = [...permaCodes];
                    newPermaCodes.splice(index, 1);
                    setPermaCodes(newPermaCodes);
                  }}
                />
              </div>
            ))}
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

const CrossIcon = ({
  onClose,
  className,
}: {
  onClose: () => void;
  className: string;
}) => {
  return (
    <div onClick={onClose} className={`flex my-auto ${className}`}>
      <svg
        className="fill-current text-black"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 18 18"
      >
        <path d="M18 1.5l-1.5-1.5-6 6-6-6-1.5 1.5 6 6-6 6 1.5 1.5 6-6 6 6 1.5-1.5-6-6z"></path>
      </svg>
    </div>
  );
};

export default App;
