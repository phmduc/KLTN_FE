import "./UserAdmin.css";
import Admin from "../../layouts/Admin/Admin";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import { useDispatch } from "react-redux";
function UserAdmin() {
  const [isLoad, setLoaded] = useState(false);

  const [users, setUsers] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 6;
  const currentItems = users.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(users.length / 6);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 6) % users.length;
    setItemOffset(newOffset);
  };
  useEffect(() => {
    getUser();
  }, [isLoad]);
  async function getUser() {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  const handleDelete = async (index) => {
    try {
      const res = await axios.delete("/api/users/" + users[index + 1]._id);
    } catch (err) {
      throw new Error("Invalid Product Data");
    }
    setLoaded(!isLoad);
    toast.success(`Xóa thành công`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  return (
    <Admin>
      <div className="userManage">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div class="content table-responsive table-full-width">
                <table class="table table-hover table-striped">
                  <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Active</th>
                    <th>Controls</th>
                  </thead>
                  <tbody>
                    {currentItems.map((elem, index) => {
                      return (
                        <tr>
                          <td>{elem.name}</td>
                          <td>{elem.email}</td>
                          <td>
                            <input
                              type="checkbox"
                              class="form-check-input"
                              id="exampleCheck1"
                              defaultChecked={elem.isAdmin}
                              onChange={async (e) => {
                                const res = await axios.put(
                                  "/api/users/" + elem._id,
                                  { isAdmin: e.target.checked }
                                );
                                toast.success(`Thay đổi thành công`, {
                                  position: toast.POSITION.TOP_CENTER,
                                });
                              }}
                            />
                          </td>
                          <td>
                            {elem.isVerify ? (
                              <span className="d-block">Activated</span>
                            ) : (
                              <span className="d-block">Not Activated</span>
                            )}
                          </td>
                          <td className="controls">
                            <button
                              className="btn btn-primary"
                              onClick={(e) => {
                                handleDelete(index - 1);
                              }}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <ReactPaginate
                  className="pagination"
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export default UserAdmin;
