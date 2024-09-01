"use client";

import { ModalAlertDelete } from "@/components/modal";
import MenuContainer, {
  MenuBreadCrumbs,
  MenuAddTitle,
  ButtonActionLinkMenu,
  ButtonActionFunctionMenu,
  MenuNothing,
} from "@/components/menu";
import { userStatus, UsersType } from "@/components/options";
import { GetAllUsers } from "@/utils/server/users/user";
import { useEffect, useState } from "react";
import { CiViewList } from "react-icons/ci";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { MdDelete, MdDetails } from "react-icons/md";

type SortKey = keyof UsersType;

export default function Page() {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const fetchUser = async () => {
    try {
      const callFunction = await GetAllUsers();
      setUsers(callFunction);
    } catch (error) {
      console.log("Gagal dalam menapat data");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState({ value: "", bolean: false });

  useEffect(() => {
    fetchUser();
  }, []);

  const sortData = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUser = () => {
    let sortableItems = [...users];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  const RESULTS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedUser().length / RESULTS_PER_PAGE);
  const displayedSortedUser = sortedUser().slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Menu User"]}
        titleLinkArray={["/admin/dashboard", "/admin/menu_user/users"]}
        endTitle={"Users"}
      />

      <MenuContainer>
        <MenuNothing title="Daftar Users" titleIcon={<CiViewList />} />

        <hr />

        <div className="overflow-x-hidden form-control justify-between min-h-96">
          {sortedUser().length > 0 ? (
            <>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("user_mail")}
                      >
                        NO KTP {getSortIcon("user_mail")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("user_fullname")}
                      >
                        NAMA LENGKAP {getSortIcon("user_fullname")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("user_phone")}
                      >
                        NO HP {getSortIcon("user_phone")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("user_alamat")}
                      >
                        ALAMAT {getSortIcon("user_alamat")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("user_status")}
                      >
                        STATUS {getSortIcon("user_status")}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedSortedUser.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <ButtonActionLinkMenu
                            link={`/admin/menu_user/users/editdata/${user.user_mail}`}
                            btnType={"btn-warning"}
                            icon={<MdDetails />}
                          />
                        </div>
                      </td>
                      <td>
                        {(currentPage - 1) * RESULTS_PER_PAGE + index + 1}
                      </td>
                      <td>{user.user_mail}</td>
                      <td>{user.user_fullname}</td>
                      <td>{user.user_phone}</td>
                      <td>{user.user_alamat}</td>
                      <td>{userStatus[user.user_status]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="join flex items-center justify-center gap-8">
                <button
                  className={`join-item ${
                    currentPage === 1 ? "hidden" : "flex"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <i>
                    <FaAngleDoubleLeft />
                  </i>
                </button>
                <div className="join-item text-sm font-normal">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className={`join-item ${
                    currentPage === totalPages ? "hidden" : "flex"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <i>
                    <FaAngleDoubleRight />
                  </i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center">Tidak ada Data</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
