var result = cssobj({
  "div": {
    "fontSize": "12px",
    "color": "blue"
  },
  "@media (max-width: 800px)": {
    ".active": {
      "color": "purple",
      "div &": {
        "color": "red",
        "@media (min-width: 100px)": {
          "color": "green"
        }
      }
    }
  }
}, {
  local:{
    prefix:'_prefix_'
  }
})

log(css(result), 'file:./selector-nest-and.css')

