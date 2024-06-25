"use client";

import { ModalAlertDelete } from "@/components/form";
import MenuContainer, {
  MenuBreadCrumbs,
  MenuAddTitle,
  ButtonActionLinkMenu,
  ButtonActionFunctionMenu,
} from "@/components/menu";
import { userStatus } from "@/components/options";

import { DeleteUser, GetAllUsers } from "@/utils/server/users/user";
import { user_status } from "@prisma/client";

import { useEffect, useState } from "react";

import { CiViewList } from "react-icons/ci";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Page() {
  const [users, setUsers] = useState<
    {
      user_ktp: string;
      user_fullname: string;
      user_phone: string;
      user_alamat: string;
      user_warning: number;
      user_status: user_status;
    }[]
  >([]);

  const fetchUser = async () => {
    try {
      const callFunction = await GetAllUsers();
      setUsers(callFunction);
    } catch (error) {
      console.log("Gagal dalam menapat data");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteUser = async (userKtp: string) => {
    try {
      await DeleteUser(userKtp);
      await fetchUser();
      setIsModalOpen(false);
    } catch (error) {
      console.log("Gagal menghapus user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <section className="container mx-auto px-24">
      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Menu User"]}
        titleLinkArray={["/admin/dashboard", "/admin/menu_user/users"]}
        endTitle={"Users"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Users"
          titleIcon={<CiViewList />}
          linkButton="/admin/menu_user/users/adddata"
        />

        <hr />

        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>NO</th>
                  <th>NO KTP</th>
                  <th>NAMA LENGKAP</th>
                  <th>NO HP</th>
                  <th>ALAMAT</th>
                  <th>PERINGATAN</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <ButtonActionLinkMenu
                          link={`/admin/menu_user/users/editdata/${user.user_ktp}`}
                          btnType={"btn-warning"}
                          icon={<FaPencilAlt />}
                        />

                        <ButtonActionFunctionMenu
                          btnFunction={() => setIsModalOpen(true)}
                          btnType={"btn-error"}
                          icon={<MdDelete />}
                        />

                        <ModalAlertDelete
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onSubmit={async () => await deleteUser(user.user_ktp)}
                        />
                      </div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{user.user_ktp}</td>
                    <td>{user.user_fullname}</td>
                    <td>{user.user_phone}</td>
                    <td>{user.user_alamat}</td>
                    <td>{user.user_warning}</td>
                    <td>{userStatus[user.user_status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">Tidak ada Data</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
