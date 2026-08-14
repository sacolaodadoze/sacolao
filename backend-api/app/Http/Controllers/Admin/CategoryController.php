<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Validation\Rule;

use function Laravel\Prompts\alert;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->orderBy('position');
            }])
            ->orderBy('position')
            ->get();
        return response()->json($categories);
    }


    public function store(Request $request)
    {
        //dd($request->all());
        $request->validate([
            'slug' => [
                'required',
                'string',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('categories')->ignore($request->id),
            ],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                'not_in:' . $request->id,
            ],
        ]);
        Category::create($request->all());

        return response()->json([
            'message' => 'Categoria criada'
        ]);
    }

    public function update(Request $request, Category $category)
    {
        // dd($category);
        $category->update($request->except(['children'])  /* $request->all() */);

        if ($category->children()->exists()) {            
            $category->children()->update(['active' => $category->active ]);
        }

        return response()->json([
            'message' => 'Categoria atualizada'
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Categoria excluída'
        ]);
    }
}
