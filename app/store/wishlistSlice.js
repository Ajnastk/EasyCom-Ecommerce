import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  const res = await fetch("api/wishlist");
  if (!res.ok) throw new Error("Unauthorized");
  return (await res.json()).products;
});

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId, thunkAPI) => {
    const state = thunkAPI.getState().wishlist;
    const isInWishList = state.items.some((item) => item.id === productId);

    const method = isInWishList ? "DELETE" : "POST";
    await fetch("/api/wishlist", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    return { productId, add: !isInWishList };
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId, add } = action.payload;
        if (add) {
          state.items.push({ _id: productId });
        } else {
          state.items = state.items.filter((item) => item._id !== productId);
        }
      });
  },
});

export default wishlistSlice.reducer;
