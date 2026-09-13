import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

const endOfAddModal = `                </div>
              </form>
            </div>
          </div>
        )}

      </div>`;

const editModal = `                </div>
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODAL 4: EDIT PRODUCT MODAL
           ------------------------------------------------------------- */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-2xl rounded-sm p-6 md:p-8 border border-[#E5E1DA] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Catalog Management
              </span>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mt-1 mb-6">
                Edit Garment
              </h2>

              <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Habesha Kemis">Habesha Kemis</option>
                      <option value="Men's Traditional Wear">Men's Traditional Wear</option>
                      <option value="Wedding Collection">Wedding Collection</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Scarves">Scarves & Netela</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Region
                    </label>
                    <select
                      value={newRegion}
                      onChange={e => setNewRegion(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    >
                      <option value="Amhara">Amhara Heritage</option>
                      <option value="Tigray">Tigray Heritage</option>
                      <option value="Oromo">Oromo Heritage</option>
                      <option value="Gurage">Gurage Heritage</option>
                      <option value="Harari">Harari Heritage</option>
                      <option value="National Heritage">National Heritage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Price (ETB / Birr)
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={e => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={newOrigPrice || ''}
                      onChange={e => setNewOrigPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                      Stock Level
                    </label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={e => setNewStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Product Image
                  </label>
                  <div className="flex flex-col gap-2">
                    {newImage && (
                      <div className="relative w-32 h-32 border border-[#E5E1DA] rounded-sm overflow-hidden mb-2">
                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingImage(true);
                          try {
                            const { FirestoreStorageService } = await import('../services/firebaseService.js');
                            const url = await FirestoreStorageService.uploadProductImage(file);
                            setNewImage(url);
                          } catch (err) {
                            console.error('Image upload failed:', err);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          } finally {
                            setIsUploadingImage(false);
                          }
                        }}
                        className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-[#1A1A1A] file:text-white hover:file:bg-[#C5A059] file:transition-colors file:cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">OR</span>
                      <input
                        type="url"
                        placeholder="Paste Image URL"
                        value={newImage}
                        onChange={e => setNewImage(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] rounded-sm text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full p-3 bg-[#FCFBFA] text-[#1A1A1A] border border-[#E5E1DA] rounded-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E1DA]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingImage}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white font-bold rounded-sm uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>`;

content = content.replace(endOfAddModal, editModal);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
