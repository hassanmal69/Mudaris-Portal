// this file is to keep the  code we removed from the codebase
// it is not used anymore, but we want to keep it for reference
// in case we need to restore it in the future

{
  /* <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-medium text-m text-[#EEEEEE]">
            Direct Messages
          </SidebarGroupLabel>
          <SidebarMenu>
            {users.map((user, id) => {
              return (
                <SidebarMenuItem key={user.user_id}>
                  <div
                    onClick={() => handleIndividualMessage(user)}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#480c48] cursor-pointer"
                  >
                    {
                      user.user_profiles?.avatar_url ? (
                        <Avatar className="w-7 h-7">
                          <AvatarImage
                            src={user?.user_profiles?.avatar_url}
                            alt={user?.user_profiles?.full_name}
                          />
                        </Avatar>
                      ) : (
                        getUserFallback(user?.user_profiles?.full_name, id)
                      )}

                    <span className="font-medium text-sm ">
                      {user?.user_profiles?.full_name}
                    </span>
                    <span
                      className={`ml-auto w-2 h-2 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      title={user.status}
                    ></span>
                  </div>
                </SidebarMenuItem>
              )
            })
            }
          </SidebarMenu>
        </SidebarGroup> */
}
