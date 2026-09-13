import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');

// 1. Add AdminService
content = content.replace("import { ProductService, OrderService } from '../services/api.js';", "import { ProductService, OrderService, AdminService } from '../services/api.js';");

// 2. Add states for Edit
const addModalState = "const [isAddModalOpen, setIsAddModalOpen] = useState(false);";
const editModalStates = `const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);`;
content = content.replace(addModalState, editModalStates);

// 3. Replace handleAdjustStock to use AdminService.updateProduct if possible
// It currently uses ProductService.updateStock
content = content.replace("await ProductService.updateStock(prodId, newStockVal);", "await AdminService.updateProduct(prodId, { stock: newStockVal });");
content = content.replace("await ProductService.updateStock(prodId, newStockVal);", "await AdminService.updateProduct(prodId, { stock: newStockVal });");

// 4. Update handleDeleteProduct and handleCreateProduct to use AdminService
content = content.replace("await ProductService.deleteProduct(prodId);", "await AdminService.deleteProduct(prodId);");
content = content.replace("const created = await ProductService.createProduct({", "const created = await AdminService.createProduct({");

// 5. Add handleEditProduct and handleUpdateProduct methods
const handleCreateProduct = "const handleCreateProduct = async (e: React.FormEvent) => {";
const editMethods = `  const handleEditProductClick = (product: Product) => {
    setEditingProductId(product.id);
    setNewName(product.name);
    setNewPrice(product.price);
    setNewOrigPrice(product.originalPrice);
    setNewStock(product.stock || 0);
    setNewCategory(product.category as CategoryName);
    setNewRegion(product.region as RegionName);
    setNewDesc(product.description || '');
    setNewImage(product.images?.[0] || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !newName.trim()) return;
    try {
      const updated = await AdminService.updateProduct(editingProductId, {
        name: newName,
        category: newCategory,
        region: newRegion,
        price: Number(newPrice),
        originalPrice: newOrigPrice ? Number(newOrigPrice) : undefined,
        images: [newImage],
        description: newDesc,
        stock: Number(newStock)
      });
      setProducts(prev => prev.map(p => p.id === editingProductId ? updated : p));
      setIsEditModalOpen(false);
      showToast('Garment Updated', \`"\${updated.name}" has been successfully updated.\`, 'success');
    } catch (err) {
      showToast('Error', 'Failed to update garment.', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {`;
content = content.replace(handleCreateProduct, editMethods);

// 6. Add Edit button in the table actions
const deleteButtonHtml = `<button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 ml-auto"
                            title="Delete this heritage product entirely"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>`;
const actionsHtml = `<div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProductClick(prod)}
                            className="px-3 py-1 bg-white hover:bg-gray-100 border border-[#E5E1DA] hover:border-black rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 text-[#1A1A1A]"
                            title="Edit this product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1"
                            title="Delete this heritage product entirely"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>`;
content = content.replace(deleteButtonHtml, actionsHtml);

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
