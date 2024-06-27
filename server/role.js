const admin = [
  "SHOW_USER",
  "MANAGE_USER",
  "SHOW_ROLE",
  "MANAGE_ROLE",
]
const user = [
  "SHOW_USER",
  "SHOW_ROLE",
]
const all = [
  {
    name: "SHOW_USER",
    des: "SHOW_USER",
    key: "SHOW_USER",
  },
  {
    name: "MANAGE_USER",
    des: "MANAGE_USER",
    key: "MANAGE_USER"
  },
  {
    name: "SHOW_ROLE",
    des: 'SHOW_ROLE',
    key: 'SHOW_ROLE'
  },{
    name: "MANAGE_ROLE",
    des: "MANAGE_ROLE",
    key: "MANAGE_ROLE"
  },{
    name: 'SHOW_MAIN',
    des: 'SHOW_MAIN',
    key: 'SHOW_MAIN'
  },{
    name: "MANAGE_MAIN",
    des: 'MANAGE_MAIN',
    key: 'MANAGE_MAIN'
  }
]

module.exports = {
  admin,
  user,
  all
}
