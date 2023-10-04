import ProfileTable from "./ProfileTable";

const ProfileModal = () => {
  return (
    <dialog id="profile_modal" className="modal ">
      <form method="dialog" className="modal-box max-w-4xl max-h-full">
        <h3>Profile Catalog</h3>
        <div className="">
          <ProfileTable />
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ProfileModal;
